# Required

- Download [Git](https://git-scm.com/) and install it
- A general CLI (Command Line Interface)

# Understand Git

Git can connect a **remote/origin** with a **local** one git repository.<br>
Git can import `git pull` from remote to local or export `git push` from local to remote.<br>
Git use three different storage spaces in each of case **remote** or **local**:

<br>

file system  | index                | repository
------------ | -------------------- | ----------------
local folder | space in local cache | git local folder
             | `git add`            | `git commit`

<br>

# All Steps

--------------------------------------------------------------------------------

## Some Command Line to keep in mind.

`ls -a`
<small>  Show a list of files in the actual path</small>

`cd`_`folder`_
<small>  Extend the path into a new folder</small>

`cd ..`
<small>  Go a position back on the actual path</small>

`git branch`
<small>  Show a list of branches of the local folder * is the active one</small>

`git checkout branch`
<small>  Move into a branch</small>

--------------------------------------------------------------------------------

## 1\. (First-Time only) Clone our Repository from remote to local.

`git clone https://github.com/9i0xin9/framework-share`
<small>  Move into the right path with cd</small>

`git checkout -b`_`mybranch`_
<small>  Set a personal branch to work with</small>

--------------------------------------------------------------------------------

## 1\. Update local personal branch with the ones from remote develop branch.

`git pull origin`_`development:mybranch`_

--------------------------------------------------------------------------------

## 2\. Make your work all over your local folder.

--------------------------------------------------------------------------------

## 3\. Add and Commit files from local folder into local Git.

`git add *`
<small>  Add all files from your local folder into the index git space</small>

`git commit -m "`_`helper to what you have work on`_`"`
<small>  Commit all files into your local git repository</small>

--------------------------------------------------------------------------------

## 4\. Update again in case of new update from others devs.

`git pull origin`_`development:development`_

--------------------------------------------------------------------------------

## 5\. Adjust if exist some merge conflict.

Take care to delete:

`<<<<<<HEAD line`<br>
`======`<br>
`BRANCH line>>>>>>`

just to keep the right codeline sequence.

--------------------------------------------------------------------------------

## 6\. Re-add modified files and commit again it.

`git add *`

`git commit -m "`_`helper to what you have work on`_`"`

--------------------------------------------------------------------------------

## 7\. Push all files on the remote develop branch.

`git push origin`_`mybranch:development`_

--------------------------------------------------------------------------------
