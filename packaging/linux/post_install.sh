#! /usr/bin/env bash

# This script handles distro-independent Linux post-install tasks. Currently
# that means managing the /keybase redirector mountpoint. The deb-
# and rpm-specific post-install scripts call into this after doing their
# distro-specific work, which is mainly setting up package repos for updates.

set -u

rootmount="/keybase"
krbin="/usr/bin/keybase-redirector"

vardirDeprecated="/var/lib/keybase"
khuserDeprecated="keybasehelper"
khbinDeprecated="/usr/bin/keybase-mount-helper"
optDeprecated="/opt/keybase/mount-readme"

chown root:root "$krbin"
chmod 4755 "$krbin"

make_mountpoint() {
  if ! mountpoint "$rootmount" &> /dev/null; then
    mkdir -p "$rootmount"
    chown root:root "$rootmount"
    chmod 755 "$rootmount"
  fi
}

run_redirector() {
  make_mountpoint

  logdir="${XDG_CACHE_HOME:-$HOME/.cache}/keybase"
  mkdir -p "$logdir"
  nohup "$krbin" "$rootmount" >> "$logdir/keybase.redirector.log" 2>&1 &
}

currlink="$(readlink -m "$rootmount")"
if [ -n "$currlink" ] ; then
    # Upgrade from a rootlink-based build.
    if rm "$rootmount" &> /dev/null ; then
        echo Replacing old $rootmount symlink.
    fi
    mounts=$(cat /proc/mounts | awk '{print $2}')
    # If the user currently has something mounted at $currlink, then
    # start the redirector.  Otherwise don't bother; the next
    # `run_keybase` call will start it.
    #
    # TODO: Set $IFS in case any of the mountpoints contain a space?
    # Probably not a big deal since all this loop does is start the
    # redirector, which would also be done by the next call to
    # `run_keybase`.
    for m in $mounts; do
      if [ "$m" = "$currlink" ]; then
        echo Starting root redirector at $rootmount.
        run_redirector
        break
      fi
    done
elif [ -d "$rootmount" ] ; then
    # Handle upgrading from old builds that don't have the rootlink.
    currowner=`stat -c %U "$rootmount"`
    if [ "$currowner" != "root" ]; then
        # Remove any existing legacy mount.
        echo Unmounting $rootmount...
        if killall kbfsfuse &> /dev/null ; then
            echo Shutting down kbfsfuse...
        fi
        rmdir "$rootmount"
        echo You must run run_keybase to restore file system access.
    elif killall `basename "$krbin"` &> /dev/null ; then
        # Restart the root redirector in case the binary has been updated.
        fusermount -u "$rootmount"
        run_redirector
    fi
fi

# Just in case the redirector wasn't run in any of the above cases.
make_mountpoint

# Delete the keybasehelper system user, to clean up after older
# versions.  TODO: remove this once sufficient time has passed since
# those old releases.
if userdel $khuserDeprecated &> /dev/null ; then
    echo Removing $khuserDeprecated system user, as it is no longer needed.
    rm -f "$khbinDeprecated"
    rm -rf "$vardirDeprecated"
    rm -rf "$optDeprecated"
fi

# Update the GTK icon cache, if possible.
if which gtk-update-icon-cache &> /dev/null ; then
  gtk-update-icon-cache -q -t -f /usr/share/icons/hicolor
fi
