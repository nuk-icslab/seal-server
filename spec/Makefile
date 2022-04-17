spec_src_dir := $(abspath 29549-SEAL_API_stage3-h40)
output_dir := $(abspath ../lib/openapi)
spec_output_dir := $(abspath ./build/compiled_spec)
doc_output_dir := $(abspath ./build/docs)
tmp_dir := /tmp/seal

yamls := $(wildcard $(spec_src_dir)/TS*.yaml)
seal_yamls := $(wildcard $(spec_src_dir)/TS29549_SS*.yaml)
seal_htmls := $(patsubst $(spec_src_dir)/%.yaml, $(doc_output_dir)/%.html, $(seal_yamls))

merged_api_version := 17.4.0

generator_flag := --skip-validate-spec

.PHONY: all, docs, clean

.PHONY: ss-express

all: ss-express

docs: $(seal_htmls)

ss-express: $(spec_output_dir)/ss.yaml
	mkdir -p $(output_dir)/$@
	openapi-generator-cli generate -o $(output_dir)/$@ \
	  -g nodejs-express-server $(generator_flag) \
	  -i $^

$(spec_output_dir)/%.yaml: openapi-merge-%.json $(yamls)
	mkdir -p $(@D)
	mkdir -p $(tmp_dir)

	@echo Merging used APIs\' specifications
	cp $^ $(tmp_dir)
	cd $(tmp_dir) && openapi-merge-cli -c $<

	# cp $(tmp_dir)/output.yaml $@
	# cp $(yamls) $(@D)

	@echo Compiling specifications to get rid off $$ref
	openapi-generator-cli generate -o $(tmp_dir) -g openapi-yaml -i $(tmp_dir)/output.yaml
	mv $(tmp_dir)/openapi/openapi.yaml $@

	# @echo Removing optional operationId to prevent duplication
	# yq -i 'del(.. | select(has("operationId")).operationId)' $@

	@echo Removing useless field
	yq -i 'del(.servers)' $@
	yq -i 'del(.externalDocs)' $@
	yq -i 'del(.info.description)' $@

	@echo Updating description
	yq -i '.info.title="Merged 3GPP CAPIF API. Based on $<"' $@
	yq -i '.info.version="$(merged_api_version)"' $@

	# @echo Validating the generated specification
	# openapi-generator-cli validate -i $@

	rm -rf $(tmp_dir)

$(doc_output_dir)/%.html: $(spec_src_dir)/%.yaml
	mkdir -p $(@D)
	redoc-cli build -o $@ $^

clean:
	rm -rf $(spec_output_dir)
	rm -rf $(doc_output_dir)
	rm -rf $(output_dir)
