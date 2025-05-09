#!/bin/bash
sync_main() {
  local run=${1}
  src="./public/video-data/library"
  dest="s3://skydiving-video-library"
  if [ "${run}" == "true" ]; then
    echo "syncing main library $src to $dest"
    aws s3 sync "$src" "$dest"
  else
    echo "dryrun main library $src to $dest"
    aws s3 sync --dryrun "$src" "$dest"
  fi
}

sync_solo() {
  local run=${1}
  src="./public/video-data/solo/library"
  dest="s3://skydiving-solo"
  if [ "${run}" == "true" ]; then
    echo "syncing solo library $src to $dest"
    aws s3 sync "$src" "$dest"
  else
    echo "dryrun solo library $src to $dest"
    aws s3 sync --dryrun "$src" "$dest"
  fi
}

select_library() {
  local runType=${1}
  select library in "main" "solo"; do
    case $library in
      main)
        sync_main "$1";;
      solo)
        sync_solo "$1";;
    esac
  done
}

select runType in "run" "dryrun"; do
  case $runType in
    run)
      select_library "true";;
    dryrun)
      select_library "false";;
  esac
done
