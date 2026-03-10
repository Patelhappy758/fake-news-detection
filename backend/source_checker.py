"""
Source Verification Module
Searches the web for related news articles and fact-checker results
to cross-reference user-submitted news text against real sources.
"""

import re
import time
from duckduckgo_search import DDGS

# Trusted mainstream news domains (expanded list)
TRUSTED_DOMAINS = {
    # International
    'reuters.com', 'apnews.com', 'bbc.com', 'bbc.co.uk',
    'nytimes.com', 'washingtonpost.com', 'theguardian.com',
    'cnn.com', 'npr.org', 'aljazeera.com', 'france24.com',
    'dw.com', 'abc.net.au', 'cbsnews.com', 'nbcnews.com',
    'usatoday.com', 'thehill.com', 'politico.com',
    'abcnews.go.com', 'foxnews.com', 'bloomberg.com',
    'forbes.com', 'time.com', 'newsweek.com', 'theatlantic.com',
    'wired.com', 'businessinsider.com', 'insider.com',
    'cnbc.com', 'ft.com', 'economist.com', 'independent.co.uk',
    'telegraph.co.uk', 'sky.com', 'euronews.com',
    'msn.com', 'news.yahoo.com', 'news.google.com',
    # India
    'hindustantimes.com', 'ndtv.com', 'timesofindia.indiatimes.com',
    'indiatoday.in', 'thehindu.com', 'indianexpress.com',
    'news18.com', 'livemint.com', 'economictimes.indiatimes.com',
    'firstpost.com', 'thequint.com', 'scroll.in', 'theprint.in',
    'oneindia.com', 'zeenews.india.com', 'indiatvnews.com',
    'india.com', 'deccanherald.com', 'deccanchronicle.com',
    'telegraphindia.com', 'outlookindia.com', 'moneycontrol.com',
    'dnaindia.com', 'aajtak.in', 'amarujala.com',
    'business-standard.com', 'financialexpress.com',
    # Science & Tech
    'nature.com', 'sciencemag.org', 'science.org', 'nasa.gov',
    'space.com', 'phys.org', 'sciencedaily.com', 'newscientist.com',
    'livescience.com', 'techcrunch.com', 'theverge.com', 'arstechnica.com',
}

# Fact-checking sites
FACT_CHECK_DOMAINS = {
    'snopes.com', 'politifact.com', 'factcheck.org',
    'fullfact.org', 'vishvasnews.com', 'altnews.in',
    'boomlive.in', 'factly.in', 'newschecker.in',
    'checkyourfact.com', 'leadstories.com',
    'africacheck.org', 'truthorfiction.com',
    'logically.ai', 'thequint.com',
}


def extract_search_query(text: str) -> str:
    """
    Extract a concise, searchable query from the news text.
    Takes the first ~20 meaningful words as the search query.
    """
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    # Remove HTML tags
    text = re.sub(r'<.*?>', '', text)
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s.,!?\'-]', '', text)
    # Collapse whitespace
    text = ' '.join(text.split())

    # Take first ~20 words as the search query
    words = text.split()
    query = ' '.join(words[:20])
    return query.strip()


def _get_domain(url: str) -> str:
    """Extract the domain from a URL."""
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        if domain.startswith('www.'):
            domain = domain[4:]
        return domain
    except Exception:
        return ''


def _classify_source(domain: str) -> str:
    """Classify a source domain as trusted, fact-checker, or general."""
    if not domain:
        return 'general'
    # Check exact match first
    if domain in FACT_CHECK_DOMAINS:
        return 'fact-checker'
    if domain in TRUSTED_DOMAINS:
        return 'trusted'
    # Check if it's a subdomain of a trusted/fact-check domain
    for td in TRUSTED_DOMAINS:
        if domain.endswith('.' + td):
            return 'trusted'
    for fd in FACT_CHECK_DOMAINS:
        if domain.endswith('.' + fd):
            return 'fact-checker'
    return 'general'


def search_web_sources(query: str, max_results: int = 8) -> list:
    """
    Search DuckDuckGo for news articles related to the query.
    Returns a list of source dicts.
    """
    sources = []
    ddgs = DDGS()

    # 1. Search news
    try:
        news_results = list(ddgs.news(query, max_results=max_results))
        for r in news_results:
            domain = _get_domain(r.get('url', ''))
            sources.append({
                'title': r.get('title', ''),
                'url': r.get('url', ''),
                'snippet': r.get('body', ''),
                'domain': domain,
                'source_type': _classify_source(domain),
                'date': r.get('date', ''),
                'source_name': r.get('source', '') or domain,
            })
    except Exception as e:
        print(f"  [source_checker] News search error: {e}")

    # 2. General web search for broader coverage
    try:
        web_results = list(ddgs.text(query, max_results=5))
        existing_urls = {s['url'] for s in sources}
        for r in web_results:
            url = r.get('href', '')
            if url not in existing_urls:
                domain = _get_domain(url)
                sources.append({
                    'title': r.get('title', ''),
                    'url': url,
                    'snippet': r.get('body', ''),
                    'domain': domain,
                    'source_type': _classify_source(domain),
                    'date': '',
                    'source_name': domain,
                })
    except Exception as e:
        print(f"  [source_checker] Web search error: {e}")

    return sources


def check_fact_checkers(query: str) -> list:
    """
    Specifically search fact-checking sites for this claim.
    """
    fact_check_results = []
    fact_check_query = f"{query} fact check"

    try:
        ddgs = DDGS()
        results = list(ddgs.text(fact_check_query, max_results=5))
        for r in results:
            domain = _get_domain(r.get('href', ''))
            src_type = _classify_source(domain)
            fact_check_results.append({
                'title': r.get('title', ''),
                'url': r.get('href', ''),
                'snippet': r.get('body', ''),
                'domain': domain,
                'source_type': src_type if src_type == 'fact-checker' else 'general',
                'source_name': domain,
            })
    except Exception as e:
        print(f"  [source_checker] Fact-check search error: {e}")

    return fact_check_results


def compute_credibility_summary(sources: list) -> dict:
    """
    Analyze the collected sources and produce a credibility summary.
    """
    total = len(sources)
    trusted_count = sum(1 for s in sources if s['source_type'] == 'trusted')
    fact_check_count = sum(1 for s in sources if s['source_type'] == 'fact-checker')

    if total == 0:
        return {
            'verdict': 'inconclusive',
            'message': 'No related sources found online. This news could not be verified through web sources. Exercise caution.',
            'trusted_count': 0,
            'fact_check_count': 0,
            'total_sources': 0,
        }

    if fact_check_count > 0:
        verdict = 'fact-checked'
        message = f'Found {fact_check_count} fact-checker result(s). Check the fact-checker links below for detailed verification.'
    elif trusted_count >= 2:
        verdict = 'corroborated'
        message = f'Found {trusted_count} trusted news source(s) reporting similar content. This news appears to be covered by reputable outlets.'
    elif trusted_count == 1:
        verdict = 'partially-verified'
        message = f'Found {total} related source(s) including 1 trusted outlet. Consider verifying from additional major sources.'
    elif total >= 3:
        verdict = 'partially-verified'
        message = f'Found {total} related source(s) online. Some coverage exists but not from major trusted outlets.'
    else:
        verdict = 'low-coverage'
        message = f'Only {total} source(s) found with limited coverage. Verify from additional sources before trusting.'

    return {
        'verdict': verdict,
        'message': message,
        'trusted_count': trusted_count,
        'fact_check_count': fact_check_count,
        'total_sources': total,
    }


def verify_news(text: str) -> dict:
    """
    Main entry point: verify a news text against web sources.
    Returns a dict with sources list and credibility summary.
    """
    start_time = time.time()

    # Step 1: Extract a search query
    query = extract_search_query(text)
    print(f"  [source_checker] Search query: '{query}'")

    # Step 2: Search for related news articles
    sources = search_web_sources(query)

    # Step 3: Check fact-checking sites
    fact_checks = check_fact_checkers(query)

    # Merge fact-check results (avoid duplicates)
    existing_urls = {s['url'] for s in sources}
    for fc in fact_checks:
        if fc['url'] not in existing_urls:
            sources.append(fc)

    # Step 4: Compute credibility summary
    credibility = compute_credibility_summary(sources)

    elapsed = round(time.time() - start_time, 2)
    print(f"  [source_checker] Found {len(sources)} sources in {elapsed}s")
    print(f"  [source_checker] Trusted: {credibility['trusted_count']}, Fact-checks: {credibility['fact_check_count']}")

    return {
        'sources': sources[:12],  # Cap at 12 sources
        'credibility': credibility,
        'search_query': query,
        'verification_time': f'{elapsed}s',
    }
