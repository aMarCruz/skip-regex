# Send coverage report from node 6 builds of any branch

CURBUILD = "$(TRAVIS_NODE_VERSION)"
REQBUILD = "6.14"

setup_cover:
ifeq ($(CURBUILD),$(REQBUILD))
	@ npm i -g codecov
endif

node_test:
	@ yarn lint
	@ yarn test

send_cover:
ifeq ($(CURBUILD),$(REQBUILD))
	@ echo Sending coverage report...
	@ nyc report -r=lcov
	@ codecov -f ./coverage/lcov.info
else
	@ echo The coverage report will be sent in $(REQBUILD)
endif

.PHONY: setup_cover send_cover node_test
