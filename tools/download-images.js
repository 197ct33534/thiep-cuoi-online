const fs = require('fs');
const https = require('https');
const path = require('path');

// Create images-vip directory if it doesn't exist
const imageDir = path.join(__dirname, 'images-vip');
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
}

// List of image URLs from your HTML
const imageUrls = [
    'https://tonywedding.vn/wp-content/uploads/2024/05/z5472192614627_2cef29ec383dfcf6781c305b9660fa3e.jpg',
    'https://tonywedding.vn/wp-content/uploads/2024/05/z5472197407576_29868d899482d310df93d9f89f4f3a09.jpg',
    'https://tonywedding.vn/wp-content/uploads/2024/05/z5472197124414_96a935a7f08a7873e72ace5edaba2c47.jpg',
    'https://tonywedding.vn/wp-content/uploads/2024/05/z5472197269268_8936bedfcaeb9c600b4c0345f2376bb2.jpg',
    'https://tonywedding.vn/wp-content/uploads/2024/05/z5472197452312_22329fb788d005f96998a3800f9c1f67.jpg',
    'https://tonywedding.vn/wp-content/uploads/2024/05/z5472197154636_152843c81c07193bcc4eac87f108672b.jpg',
    'https://tonywedding.vn/wp-content/uploads/2024/05/z5472197468601_9915ce6178b5266f0c074ed3cbda98df.jpg',
    'https://tonywedding.vn/wp-content/uploads/2024/05/z5472197287817_594197fda03680c82b524c3ec481a954.jpg',
    'https://tonywedding.vn/wp-content/uploads/2024/05/z5472197022361_796d96e79e5428da8bd94ae3f2813ae3.jpg',
    'https://tonywedding.vn/wp-content/uploads/2024/05/7-5.png',
    'https://tonywedding.vn/wp-content/uploads/2024/05/z5472197114186_249c51258c69e7ec7418ef29437e626e.jpg',
    'https://tonywedding.vn/wp-content/uploads/2024/05/z5472197376630_5ac37fadc97dc9bccf662743d370adef.jpg'
];

// Download function
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }

            const filepath = path.join(imageDir, filename);
            const fileStream = fs.createWriteStream(filepath);

            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Downloaded: ${filename}`);
                resolve();
            });

            fileStream.on('error', (err) => {
                fs.unlink(filepath, () => {}); // Delete the file if error occurs
                reject(err);
            });
        }).on('error', reject);
    });
}

// Download all images
async function downloadAllImages() {
    try {
        const downloads = imageUrls.map((url, index) => {
            const filename = `wedding-${index + 1}${path.extname(url)}`;
            return downloadImage(url, filename);
        });

        await Promise.all(downloads);
        console.log('All images downloaded successfully!');

        // Update HTML file with local image paths
        let htmlContent = fs.readFileSync('index.html', 'utf8');
        imageUrls.forEach((url, index) => {
            const localPath = `/images-vip/wedding-${index + 1}${path.extname(url)}`;
            htmlContent = htmlContent.replaceAll(url, localPath);
        });
        fs.writeFileSync('index.html', htmlContent);
        console.log('HTML file updated with local image paths!');

    } catch (error) {
        console.error('Error downloading images:', error);
    }
}

// Run the download
downloadAllImages();