const { addonBuilder } = require("stremio-addon-sdk")

const manifest = {
    "id": "community.akshay.test",
    "version": "1.0.0",
    "name": "My First Custom Addon",
    "description": "Learning how to use the Stremio SDK",
    "types": ["movie"],
    // Resources tell Stremio what this addon can do
    "resources": ["catalog", "stream"],
    "catalogs": [
        {
            "type": "movie",
            "id": "test_catalog",
            "name": "My Custom List"
        }
    ]
}

const builder = new addonBuilder(manifest)

// 1. This defines what shows up in your "Catalog" list
builder.defineCatalogHandler((args) => {
    if (args.id === "test_catalog") {
        return Promise.resolve({
            metas: [
                {
                    id: "tt0068646", // A fake or real IMDB ID
                    type: "movie",
                    name: "Big Buck Bunny",
                    poster: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg",
                    description: "A giant rabbit deals with three bullying squirrels."
                }
            ]
        })
    } else {
        return Promise.resolve({ metas: [] })
    }
})

// 2. This defines the actual video link when you click 'Play'
builder.defineStreamHandler((args) => {
    if (args.id === "tt0068646") {
        return Promise.resolve({
            streams: [
                {
                    title: "Watch in HD (HTTP)",
                    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                }
            ]
        })
    } else {
        return Promise.resolve({ streams: [] })
    }
})

module.exports = builder.getInterface()