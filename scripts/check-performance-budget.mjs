import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(projectRoot, 'dist');
const budgetPath = path.join(projectRoot, 'performance-budget.json');
const budgets = JSON.parse(await readFile(budgetPath, 'utf8'));

async function collectFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const absolutePath = path.join(directory, entry.name);
			if (entry.isDirectory()) return collectFiles(absolutePath);

			const metadata = await stat(absolutePath);
			return [{ absolutePath, bytes: metadata.size, extension: path.extname(entry.name).toLowerCase() }];
		}),
	);

	return files.flat();
}

function formatBytes(bytes) {
	return `${(bytes / 1024).toFixed(1)} KB`;
}

const files = await collectFiles(outputDirectory);
const violations = [];

for (const [name, budget] of Object.entries(budgets)) {
	const matchingFiles = files.filter((file) => budget.extensions.includes(file.extension));
	const totalBytes = matchingFiles.reduce((total, file) => total + file.bytes, 0);
	const largestFile = matchingFiles.reduce(
		(largest, file) => (file.bytes > (largest?.bytes ?? 0) ? file : largest),
		null,
	);

	if (largestFile && largestFile.bytes > budget.maxFileBytes) {
		violations.push(
			`${name}: ${path.relative(projectRoot, largestFile.absolutePath)} is ${formatBytes(largestFile.bytes)} ` +
				`(limit ${formatBytes(budget.maxFileBytes)})`,
		);
	}

	if (totalBytes > budget.maxTotalBytes) {
		violations.push(
			`${name}: total is ${formatBytes(totalBytes)} (limit ${formatBytes(budget.maxTotalBytes)})`,
		);
	}

	console.log(
		`${name.padEnd(12)} ${String(matchingFiles.length).padStart(3)} files  ` +
			`total ${formatBytes(totalBytes).padStart(10)}  ` +
			`largest ${formatBytes(largestFile?.bytes ?? 0).padStart(10)}`,
	);
}

if (violations.length > 0) {
	console.error('\nPerformance budget exceeded:');
	violations.forEach((violation) => console.error(`- ${violation}`));
	process.exitCode = 1;
} else {
	console.log('\nPerformance budgets passed.');
}
