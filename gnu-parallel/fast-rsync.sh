#!/bin/sh

cd /mnt

# rsync -av vol0/lunia07/dsc3m space/vol0/lunia07
#
#  --dry-run \
#  -j 2 \

parallel \
  --output-as-files \
  '[ -d space/{//} ] || mkdir -p space/{//} && rsync -av {} space/{//}' \
  ::: vol{0,1,2}/*/*

