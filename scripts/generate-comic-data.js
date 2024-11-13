const fs = require("fs").promises;
const path = require("path");

async function generateComicData() {
	// Go up one directory level from scripts to find the root directory
	const rootDir = path.join(__dirname, "..");
	const imagesDir = path.join(rootDir, "images");
	const outputFile = path.join(rootDir, "comic-data.js");

	try {
		// Verify images directory exists
		try {
			await fs.access(imagesDir);
		} catch (error) {
			console.error(`Error: Images directory not found at ${imagesDir}`);
			console.log(
				'\nMake sure you have an "images" folder in your project root directory.'
			);
			process.exit(1);
		}

		// Read the images directory
		const files = await fs.readdir(imagesDir);

		// Filter for image files
		const imageFiles = files.filter((file) => {
			const ext = path.extname(file).toLowerCase();
			return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
		});

		if (imageFiles.length === 0) {
			console.log("No image files found in the images directory.");
			console.log("Supported formats: jpg, jpeg, png, gif, webp");
			process.exit(1);
		}

		// Get file stats and create data array
		const fileData = await Promise.all(
			imageFiles.map(async (file, index) => {
				const filePath = path.join(imagesDir, file);
				const stats = await fs.stat(filePath);

				return {
					file,
					created: stats.birthtime,
					path: `images/${file}`,
				};
			})
		);

		// Sort by creation date
		fileData.sort((a, b) => a.created - b.created);

		// Create the comic pages array
		const comicPages = fileData.map((file, index) => ({
			id: index + 1,
			title: `Page ${index + 1}`,
			image: file.path,
			date: file.created.toISOString().split("T")[0],
		}));

		// Generate the JavaScript content
		const jsContent = `// Auto-generated on ${new Date().toISOString()}
const comicPages = ${JSON.stringify(comicPages, null, 4)};`;

		// Write to comic-data.js
		await fs.writeFile(outputFile, jsContent, "utf8");

		console.log(
			`✓ Successfully generated comic-data.js with ${comicPages.length} pages`
		);
		console.log("\nPage summary:");
		comicPages.forEach((page) => {
			console.log(`- ${page.title}: ${page.image} (${page.date})`);
		});
	} catch (error) {
		console.error("Error generating comic data:", error);
		process.exit(1);
	}
}

// Run the generator
generateComicData();
