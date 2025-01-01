# Requirement
- Using themes `Default Dark`
- Extension: [Custom CSS and Loader](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css)

# Guide
- Copy `style.css` file into your custom dir and paste it into `vscode_custom_css` import path.
```Json
// Example window
"vscode_custom_css.imports": [],
```

# The root dark editor setup for vscode
- .mtk1   : Symbol . ; [{( Suggestion inline
- .mtk5   : Namespace definite default
- .mtk6   : Numeric
- .mtk8   : Class of html
- .mtk9   : Like variable of function
- .mtk10  : Like json =>
- .mtk11  : String
- .mtk13  : Like </ > tag of html
- .mtk13  : Like regex
- .mtk15  : Function
- .mtk16  : Like Vanguard\Http\Resources\image.jpg
- .mtk17  : Like return
- .mtk18  : Like subscriptions context.subscriptions.push(disposable) js language
- .mtk20  : Comments
- .mtk23  : Like tag html
- .tabs-container : Bar chứa các tabs
- .monaco-editor .findMatch : search match (ctr + f)
- .monaco-editor .currentFindMatch : search current match
- .button-link : link ở trang start của vscode

# Bin (Setup remote terminal into docker container)
> 🔴 This setup right on my local, you can read the code to understand the idea and create your own config. Hope this help you, goodluck!

```
---------       -------      ----------
| Local | --->  | Bin | ---> | Docker |
---------       -------      ----------
```

Clone this repo and copy `bin` directory into your bin folder local.
```sh
# Example
# /usr/local/bin
usr
|-- local
|   |-- bin
|   |   |-- mysql
|   |   |-- php
|   |   |-- php74
|   |   |-- nginx
```

In your `zsh`, `bash` or any profile export bin path. Example in my `~/zshrc`
```sh
export PATH="/usr/local/bin:$PATH"
```
> Remenber run permission executable for `mysql`, `php`, `php74` and `nginx` file, `sudo chrmod +x <file>`

## Laradock
```sh
Users
|-- ITHep
|   |-- Code
|   |   |-- Env
|   |   |   |-- Laradock
|   |   |-- Work
|   |   |-- Study
|   |   |-- Foo :))
```

```sh
# Laradock env
APP_CODE_PATH_HOST=../../
APP_CODE_PATH_CONTAINER=/var/www
```

# Foo
- [About my git note](https://github.com/thep200/git.git)
- 1 + n PHP Version in docker [here](https://msirius.medium.com/1-n-php-versions-and-projects-via-laradock-51938b337071)

# Terminal theme
```sh
echo -E "$(curl -fsSL https://raw.githubusercontent.com/zthxxx/jovial/master/jovial.zsh-theme)" > ~/.oh-my-zsh/themes/jovial.zsh-theme
```

# Font
- [Monaspace](https://monaspace.githubnext.com/)
