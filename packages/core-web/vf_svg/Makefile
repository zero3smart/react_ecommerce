# scour is disabled due to an issue that it removes empty group

all: wpants wtop wshoes

wtop:
	python merge_svg_assets.py wtop
	cp output/vf_wtop* ../assets/svg/
	#scour -i output/vf_wtop.svg -o ../assets/svg/vf_wtop.svg --set-precision=3
	#scour -i output/vf_wtop_core.svg -o ../assets/svg/vf_wtop_core.svg --set-precision=3
	#scour -i output/vf_wtop_tn.svg -o ../assets/svg/vf_wtop_tn.svg --set-precision=3

wpants:
	python merge_svg_assets.py wpants
	cp output/vf_wpants* ../assets/svg/
	#scour -i output/vf_wpants.svg -o ../assets/svg/vf_wpants.svg --set-precision=3
	#scour -i output/vf_wpants_core.svg -o ../assets/svg/vf_wpants_core.svg --set-precision=3
	#scour -i output/vf_wpants_tn.svg -o ../assets/svg/vf_wpants_tn.svg --set-precision=3

wshoes:
	python merge_svg_assets.py wshoes
	cp output/vf_wshoes* ../assets/svg/
	#scour -i output/vf_wshoes.svg -o ../assets/svg/vf_wshoes.svg --set-precision=3
	#scour -i output/vf_wshoes_core.svg -o ../assets/svg/vf_wshoes_core.svg --set-precision=3
	#scour -i output/vf_wshoes_tn.svg -o ../assets/svg/vf_wshoes_tn.svg --set-precision=3

.PHONY: wpants wtop wshoes all
