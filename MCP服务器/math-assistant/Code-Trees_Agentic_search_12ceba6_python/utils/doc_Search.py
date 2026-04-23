import logging
from sentence_transformers import SentenceTransformer, util
import torch

# Step 1: Configure logging
print("Setting up logging...")
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Step 2: Load your document
print("Loading document...")
def load_document(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

# Step 3: Split document into chunks
def split_into_chunks(content):
    print("Splitting document into chunks...")
    chunks = content.split('\n')  # You can also use `content.split('. ')` for sentence-based
    chunks = [chunk.strip() for chunk in chunks if chunk.strip()]  # remove empty lines
    print(f"Total chunks: {len(chunks)}")
    return chunks

# Step 4: Load SentenceTransformer model
print("Loading SentenceTransformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')  # Small and fast

# Step 5: Save and load embeddings
def save_embeddings_and_chunks(embeddings, chunks, filename):
    print(f"Saving embeddings and chunks to {filename}...")
    torch.save({'embeddings': embeddings, 'chunks': chunks}, filename)
    print("Embeddings and chunks saved.")

# Step 6: Load embeddings and chunks together
def load_embeddings_and_chunks(filename):
    print(f"Loading embeddings and chunks from {filename}...")
    data = torch.load(filename)
    embeddings = data['embeddings']
    chunks = data['chunks']
    print("Embeddings and chunks loaded.")
    return embeddings, chunks


# Step 6: Update embeddings with new chunks
def update_embeddings(existing_embeddings, new_chunks, model, filename):
    print("Updating embeddings with new chunks...")
    
    # Generate embeddings for new chunks
    new_embeddings = model.encode(new_chunks, convert_to_tensor=True)
    
    # Concatenate the old and new embeddings
    updated_embeddings = torch.cat((existing_embeddings, new_embeddings), dim=0)
    
    # Save the updated embeddings
    save_embeddings_and_chunks(updated_embeddings, filename)
    print("Embeddings updated and saved.")
    return updated_embeddings

# Check if embeddings are saved, otherwise generate and save
embeddings_filename = 'OSData_store.pth'

# Load or generate embeddings
try:
    chunk_embeddings, chunks = load_embeddings_and_chunks(embeddings_filename)
except FileNotFoundError:
    print("Embeddings file not found. Generating and saving embeddings...")
    content = load_document("kb1.txt")
    chunks = split_into_chunks(content)
    
    chunk_embeddings = model.encode(chunks, convert_to_tensor=True)
    save_embeddings_and_chunks(chunk_embeddings, chunks, embeddings_filename)


try:
        
    # Step 7: Update embeddings with new documents
    new_file_paths = ["new_file1.txt", "new_file2.txt"]  # List of new document files

    for new_file in new_file_paths:
        print(f"Processing new file: {new_file}")
        new_content = load_document(new_file)
        new_chunks = split_into_chunks(new_content)
        chunk_embeddings = update_embeddings(chunk_embeddings, new_chunks, model, embeddings_filename)
except:

    print("No New Files ")

# Step 8: Get the query from the user and perform semantic search
query = input("Enter what you are searching for: ")

def semantic_search(query, top_k=3):
    print("Encoding query...")
    query_embedding = model.encode(query, convert_to_tensor=True)

    print("Calculating cosine similarity...")
    cosine_scores = util.pytorch_cos_sim(query_embedding, chunk_embeddings)

    print(f"Retrieving top {top_k} results...")
    top_results = torch.topk(cosine_scores, k=top_k)

    logging.info(f"Top {top_k} results for query: '{query}'")
    for score, idx in zip(top_results[0][0], top_results[1][0]):
        logging.info(f"[Score: {score:.4f}] {chunks[idx]}")
    return cosine_scores
    
# Step 9: Run the search function
print("Starting semantic search...")
semantic_search(query)
print("Search complete.")
