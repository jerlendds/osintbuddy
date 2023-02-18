from neomodel import StructuredNode, StringProperty, ArrayProperty, RelationshipTo, RelationshipFrom, IntegerProperty, DateTimeProperty


class GoogleResult(StructuredNode):
    title = StringProperty()
    description = StringProperty()
    breadcrumb = StringProperty()
    url = StringProperty(unique_index=True)
    question = StringProperty()
    result_type = StringProperty()
    index = IntegerProperty()
    search = RelationshipTo('GoogleSearch', 'GOOGLESEARCH')


class GoogleSearch(StructuredNode):
    last_searched = DateTimeProperty(default_now=True)
    search_query = StringProperty(unique_index=True)
    pages = IntegerProperty()
    related_searches = ArrayProperty(base_property=StringProperty())
    result_stats = ArrayProperty(base_property=StringProperty())
    results = RelationshipFrom('GoogleResult', 'GOOGLESEARCH')


def get_google_search_results(tx, search_query, pages):     
    return [{
            "id": result._id,
            "result_type": result.get("result_type"),
            "index": result.get("index"),
            "breadcrumb": result.get("breadcrumb"),
            "description": result.get("description"),
            "title": result.get("title"),
            "url": url,
    } for record in tx.run((
            "MATCH (n:GoogleSearch {search_query: $search_query, pages: $pages})"
            "-[]-(r) RETURN n, r"
    ), search_query=search_query, pages=pages) if (url := (result := record['r']).get('url'))]
