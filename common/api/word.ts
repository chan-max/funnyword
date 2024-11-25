


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

export async function getLocalWords({ lib, currentPage = 1, pageSize = 10 }) {
    try {

        const data = await getLibData(lib)

        const total = data.length;
        const totalPages = Math.ceil(total / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        // Paginated data slice
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
        }
    } catch (error) {
        console.error('Error in getLocalWords:', error);
        throw error;
    }
}



