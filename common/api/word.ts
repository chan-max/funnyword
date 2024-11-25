


const cache = Object.create(null);


async function getLibData(lib) {
    if (cache[lib]) {
        return cache[lib]
    }

    // Fetch the JSON data

    const response = await fetch(`/book/${lib}.json`);

    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${lib}`);
    }

    const rawText = await response.text();
    let items = rawText.split('\r\n')

    let data = items.filter(Boolean).map((i, index) => {
        return JSON.parse(i)
    })

    cache[lib] = data
    return data
}

export async function getLocalWords({ lib, currentPage = 1, pageSize = 10, random = false }) {
    try {
        const data = await getLibData(lib);

        const total = data.length;

        if (random) {
            // Shuffle the array and get the first `pageSize` elements
            const shuffled = data.slice(); // Create a copy of the array
            for (let i = shuffled.length - 1; i > 0; i--) {
                const randomIndex = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
            }
            const list = shuffled.slice(0, pageSize);

            // Return random structure
            return {
                data: {
                    currentPage: null, // No pagination in random mode
                    list,
                    pageSize,
                    total,
                    totalPages: null, // No total pages in random mode
                }
            };
        }

        // Regular pagination
        const totalPages = Math.ceil(total / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const list = data.slice(startIndex, endIndex);

        // Return paginated structure
        return {
            data: {
                currentPage,
                list,
                pageSize,
                total,
                totalPages,
            }
        };
    } catch (error) {
        console.error('Error in getLocalWords:', error);
        throw error;
    }
}




