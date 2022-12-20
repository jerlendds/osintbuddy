#!/bin/bash

docker compose exec db psql --user app -d app
# SELECT * FROM search INNER JOIN user_search ON search.id = user_search.id INNER JOIN cse_search_result ON cse_search_result.search_id = search.id;
