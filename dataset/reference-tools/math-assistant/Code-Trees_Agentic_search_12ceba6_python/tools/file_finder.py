from mcp.server import FastMCP
import os
from typing import Union, List
import asyncio
from typing import List, Union
import logging
import torch 
from sentence_transformers import SentenceTransformer, util


print("Setting up logging...")
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

MCP = FastMCP("data_app")
embeddings_filename = 'OSData_store.pth'
# Step 4: Load SentenceTransformer model
print("Loading SentenceTransformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

def load_embeddings_and_chunks(filename):
    print(f"Loading embeddings and chunks from {filename}...")
    data = torch.load(filename)
    embeddings = data['embeddings']
    chunks = data['chunks']
    print("Embeddings and chunks loaded.")
    return embeddings, chunks


def semantic_search(query,chunk_embeddings,chunks,top_k=3):        
    print("Encoding query...")
    query_embedding = model.encode(query, convert_to_tensor=True)

    print("Calculating cosine similarity...")
    cosine_scores = util.pytorch_cos_sim(query_embedding, chunk_embeddings)
    print(f"Retrieving top {top_k} results...")
    top_results = torch.topk(cosine_scores, k=top_k)

    logging.info(f"Top {top_results} results for query: '{query}")
    
    scores = []
    indices = []
    File_links = []
    for score, idx in zip(top_results[0][0], top_results[1][0]):
        logging.info(f"[Score: {score:.4f}] {chunks[idx]}")
        scores.append(score)
        indices.append(idx)
        File_links.append(chunks[idx])
    return scores,indices,File_links



@MCP.tool()
async def find_file_in_linuxOS(target_filename: str) -> Union[str, List[str]]:
    """
    Find the full filename (with extension) in a stored Linux file structure and return matching absolute paths.
    """
    try:

        try:
            chunk_embeddings, chunks = load_embeddings_and_chunks(embeddings_filename)
            query = target_filename
            score,idx,File_links = semantic_search(query,chunk_embeddings,chunks,top_k=5)
            print(File_links)
            return File_links

        except:
            print("Embeddings file not found. Generate and saving embeddings...")
           
    except Exception as e:
        return (
            f"Error: {str(e)}\n"
            f"Possible Issues:\n"
            f"1. Update the file structure using:\n"
            f"cd ~ && find / -type f 2>/dev/null >> Desktop/LLm_To_agent")

if __name__ == "__main__":
    print("Running MCP server")
    MCP.run()