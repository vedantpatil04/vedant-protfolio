# shared/

Reserved for types and constants used by *both* `client/` and `server/`
(e.g. request/response contracts once the API is implemented). Nothing
needs to live here in Phase 1 since the client uses local placeholder
data and the server has no persisted models yet — kept here so future
phases have a home for shared contracts without restructuring imports.
