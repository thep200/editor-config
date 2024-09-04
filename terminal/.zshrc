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
    corner.bottom '╰─── '
    git.dirty ' ✘'
    git.clean ' ✔'
    arrow '🔥'
    arrow.git-clean 🔥
    arrow.git-dirty 🔥
)
JOVIAL_PROMPT_PRIORITY=(
    path
    git-info
)
JOVIAL_PALETTE=(
    bracket '%F{15}'
    path '%B%F{15}%}'
    git '%F{28}'
    success '%F{040}'
    error '%F{203}'
)
JOVIAL_AFFIXES[git-info.prefix]=' ${JOVIAL_PALETTE[bracket]}('
JOVIAL_AFFIXES[git-info.suffix]='${JOVIAL_PALETTE[bracket]})${JOVIAL_PALETTE[normal]}'

# Export
export PATH=/opt/homebrew/bin:$PATH
export PATH=/opt/homebrew/sbin:$PATH
export PATH=~/Projects/Env/bin:$PATH
export PATH=/usr/local/bin:/usr/bin:$PATH

# Alias
alias ethis="vi ~/.zshrc"
alias athis="source ~/.zshrc"
alias tossh="cd ~/.ssh"

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

# Amazon Q block
[[ -f "${HOME}/Library/Application Support/amazon-q/shell/zshrc.post.zsh" ]] && builtin source "${HOME}/Library/Application Support/amazon-q/shell/zshrc.post.zsh"
