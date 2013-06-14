.PHONY: run_test_xslt
.PHONY: clean_html

xslt_processor := xsltproc

dir_prefix:= ../../code/
xml_dir:= pages
html_version_dir:= dev
html_dir:= $(dir_prefix)$(html_version_dir)
project_prefix:=

xml_files := $(wildcard $(addsuffix /*.xml, $(xml_dir) ) )
html_files := $(patsubst %.xml,%.html,$(xml_files))

# $(patsubst %.cpp,%.o,$(wildcard *.cpp))

xslt_test : $(html_files)

%.html: %.xml
#	$(xslt_processor) --xinclude --output $(patsubst %.xml,%.html, $< ) utilities/data-master.xsl $<
	$(xslt_processor) --xinclude --output $(html_dir)/$(addprefix $(project_prefix), $(notdir $(patsubst %.xml,%.html, $< ))) $<

#clean_html: $(html_files)