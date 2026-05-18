# Developer Manual

## Installation

Clone the GitHub repository and install dependencies.

```bash
npm install
```

## Running the Application

To run the application locally:

```bash
node index.js
```

The application will run on:

```txt
http://localhost:3000
```

## Environment Variables

This application uses Supabase environment variables:

```txt
SUPABASE_URL
SUPABASE_KEY
```

These variables are stored in Vercel Environment Variables for deployment.

## API Endpoints

### GET /api/fda

Retrieves cosmetic adverse event data from the openFDA API.

Example:

```txt
/api/fda?search=lotion
```

### GET /saved-searches

Retrieves saved searches from the Supabase database.

### POST /saved-search

Saves a search term into the Supabase database.

Example request body:

```json
{
  "searchTerm": "lotion"
}
```

## Tests

No automated tests were written for this version of the application. Manual testing was completed by checking:
- navigation links
- search functionality
- chart rendering
- Supabase saved searches
- Vercel deployment

## Known Bugs

Some openFDA search terms may not return results and may display an error message depending on available cosmetic event data.

## Future Development

Future updates could include:
- user authentication
- improved search filtering
- enhanced chart visualizations
- mobile responsiveness
- better error handling
- product detail pages
