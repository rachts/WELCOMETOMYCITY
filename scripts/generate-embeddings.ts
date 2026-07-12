import { generateEmbeddingsForPlaces } from '../lib/api/embeddings';

async function main() {
  console.log('Starting embedding generation process...');
  await generateEmbeddingsForPlaces();
  console.log('Done.');
  process.exit(0);
}

main().catch((error) => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});
