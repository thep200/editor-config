# Amazon Q start
[[ -f "${HOME}/Library/Application Support/amazon-q/shell/zshrc.pre.zsh" ]] && builtin source "${HOME}/Library/Application Support/amazon-q/shell/zshrc.pre.zsh"

# Zsh config
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="jovial"
plugins=(
  git
)
source $ZSH/oh-my-zsh.sh
# Theme config
JOVIAL_SYMBOL=(
  corner.top    '╭─'
  corner.bottom '╰──'
  git.dirty ' ✘'
  git.clean ' ✔'
  arrow '─➤ 🌵'
  arrow.git-clean '─➤ 🌵'
  arrow.git-dirty '─➤ 🌵'
)

JOVIAL_PROMPT_PRIORITY=(
  user
  path
  git-info
)
JOVIAL_PALETTE=(
  white   '%F{15}'
  purple  '%F{147}'
  path    '%B%F{15}%}'
  git     '%F{28}'
  success '%F{040}'
  error   '%F{203}'
)

# Promt
JOVIAL_AFFIXES[git-info.prefix]=' ${JOVIAL_PALETTE[white]}('
JOVIAL_AFFIXES[git-info.suffix]='${JOVIAL_PALETTE[white]})${JOVIAL_PALETTE[normal]}'
JOVIAL_AFFIXES[user.prefix]='${JOVIAL_PALETTE[white]}┤'
JOVIAL_AFFIXES[username]='${JOVIAL_PALETTE[purple]}${(%):-%n}'
JOVIAL_AFFIXES[user.suffix]='${JOVIAL_PALETTE[white]}│'

# Export
export PATH=/opt/homebrew/bin:$PATH
export PATH=/opt/homebrew/sbin:$PATH
export PATH=~/Projects/Env/bin:$PATH
export PATH=/usr/local/bin:/usr/bin:$PATH

# Alias
alias ethis="vi ~/.zshrc"
alias athis="source ~/.zshrc"
alias tossh="cd ~/.ssh"
alias crack="xattr -cr"
alias vdocker="lazydocker"

# NVM
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"

# Pyenv
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
export PIPENV_PYTHON="$PYENV_ROOT/shims/python"
plugin=(
  pyenv
)
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"

# Gvm
[[ -s "$HOME/.gvm/scripts/gvm" ]] && source "$HOME/.gvm/scripts/gvm"
export GOPATH=$HOME/go
export GOBIN=$HOME/go/bin
export PATH=$PATH:$GOBIN

# Function
# Git utilities
function gittag() {
  git fetch --tags
  git tag --sort=-creatordate | grep "$1" | head -n 5
}

function gitbranch() {
  max_length=$(git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short)' | awk '{ print length, $0 }' | sort -nr | head -1 | awk '{ print $1 }')
  ((max_length = max_length > 25 ? max_length : 25))
  printf "%-${max_length}s-+-%s\n" "$(printf '%*s' $max_length | tr ' ' '-')" "-------------------"
  printf "%-${max_length}s | %s\n" "Branch Name" "Last Commit"
  printf "%-${max_length}s-+-%s\n" "$(printf '%*s' $max_length | tr ' ' '-')" "-------------------"
  git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short) - %(committerdate:relative)' | head -n 10 | while read -r line; do
    branch_name=$(echo "$line" | awk -F' - ' '{print $1}')
    commit_date=$(echo "$line" | awk -F' - ' '{print $2}')
    printf "%-${max_length}s | %s\n" "$branch_name" "$commit_date"
  done
  printf "%-${max_length}s-+-%s\n" "$(printf '%*s' $max_length | tr ' ' '-')" "-------------------"
}

# File
function showfile() {
  local ext=$1
  local directory=${2:-.}

  if [[ -z "$ext" ]]; then
    echo "Usage: calculate_size extension [path]"
    echo "Example: calculate_size php       # current directory"
    echo "         calculate_size js /path  # specific path"
    return 1
  fi

  if [[ ! -d "$directory" ]]; then
    echo "Error: Directory '$directory' does not exist"
    return 1
  fi

  local count=$(find "$directory" -name "*.$ext" -type f | wc -l | tr -d ' ')
  if [[ $count -eq 0 ]]; then
    echo "No *.$ext files found in $directory"
    return 0
  fi

  find "$directory" -name "*.$ext" -type f -exec du -k {} + | \
  awk '{total+=$1} END{
    printf "Directory: '"$directory"'\n"
    printf "Extension: .*'"$ext"'\n"
    printf "Total files: '"$count"'\n"
    printf "Total size: %.2f GB\n", total/1024/1024
  }'
}

# Amazon Q block
[[ -f "${HOME}/Library/Application Support/amazon-q/shell/zshrc.post.zsh" ]] && builtin source "${HOME}/Library/Application Support/amazon-q/shell/zshrc.post.zsh"
