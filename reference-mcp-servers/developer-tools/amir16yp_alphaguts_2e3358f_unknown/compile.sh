#!/bin/bash

java -jar $(pwd)/mcp.jar setup a1.2.6
java -jar $(pwd)/mcp.jar decompile
java -jar $(pwd)/mcp.jar applypatch
java -jar $(pwd)/mcp.jar recompile

echo "Manifest-Version: 1.0" > MANIFEST.MF
echo "Main-Class: net.minecraft.server.MinecraftServer" >> MANIFEST.MF

jar cfm server.jar MANIFEST.MF -C minecraft_server/bin/
