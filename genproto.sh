PROTOC_GEN_TS_PATH="C:/Users/szymo/IdeaProjects/ConnectionSimulationNumber1/node_modules/.bin/protoc-gen-ts.cmd"
PROTOC_OUT_DIR="./proto/generated"
mkdir -p ${PROTOC_OUT_DIR}

protoc \
       --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
       --js_out="import_style=commonjs,binary:${PROTOC_OUT_DIR}" \
       --ts_out="service=grpc-web:${PROTOC_OUT_DIR}" \
       proto/player.proto
