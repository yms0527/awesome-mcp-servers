from pathlib import Path
from libzim.reader import Archive
from libzim.search import Query, Searcher
from strip_tags import strip_tags

path = Path("~/Downloads/wikipedia_en_computer_maxi_2025-07.zim").expanduser()
zim = Archive(path)

search_string = "Ruby on Rails"
query = Query().set_query(search_string)
searcher = Searcher(zim)
search = searcher.search(query)
search_count = search.getEstimatedMatches()
print(f"there are {search_count} matches for {search_string}")

for path in search.getResults(0, 1):
    entry = zim.get_entry_by_path(path)
    stripped = strip_tags(
        entry.get_item().content.tobytes(),
        keep_tags=["table", "tr", "td"],
        minify=True,
    )
    print(stripped[0:1000])
