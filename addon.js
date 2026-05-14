const { addonBuilder } = require("stremio-addon-sdk")
const axios = require("axios")
const csv = require("csvtojson")

const manifest = {
    "id": "community.unmara.automated",
    "version": "1.1.0",
    "name": "My Auto-Updating Addon",
    "description": "I update this via Google Sheets!",
    "types": ["movie"],
    "resources": ["catalog", "stream"],
    "catalogs": [
        {
            "type": "movie",
            "id": "sheet_catalog",
            "name": "My Google Sheet List"
        }
    ]
}

const builder = new addonBuilder(manifest)

// This is your specific Magic Link
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1LkUGD2biuMLKNqJmNipOd4YZsJWo4s32hwpqICFj1KM/gviz/tq?tqx=out:csv"

// This function gets the latest data from your sheet
async function getMoviesFromSheet() {
    try {
        const response = await axios.get(SHEET_URL)
        const jsonArray = await csv().fromString(response.data)
        return jsonArray
    } catch (error) {
        console.error("Error fetching sheet:", error)
        return []
    }
}

builder.defineCatalogHandler(async (args) => {
    if (args.id === "sheet_catalog") {
        const movies = await getMoviesFromSheet()
        return {
            metas: movies.map(m => ({
                id: m.id,
                type: m.type,
                name: m.name,
                poster: m.poster,
                description: "Added via Google Sheets"
            }))
        }
    }
    return { metas: [] }
})

builder.defineStreamHandler(async (args) => {
    const movies = await getMoviesFromSheet()
    const movie = movies.find(m => m.id === args.id)
    if (movie) {
        return {
            streams: [
                {
                    title: "Watch Now",
                    url: movie.url
                }
            ]
        }
    }
    return { streams: [] }
})

module.exports = builder.getInterface()