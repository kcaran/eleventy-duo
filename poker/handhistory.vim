" Vim syntax file
" Language:			Online Poker HandHistory file
" Maintainer:		Keith Carangelo (mail@kcaran.com)
" URL:				http://www.kcaran.com/poker/handhistory.vim
" Latest Revision:	$Revision: 1.2 $ $Date: 2009-01-29 15:25:17 $
"
" README:
" 
" This file will highlight PokerStars or FullTilt Hand History files (*.txt)
" that are contained under the HandHistory directory.  
"
" INSTALLATION:
"
" 1) Add the following lines to your _vimrc (or .vimrc) file.  Substitute 
" your userID for "MyUserId" for each site.
"
" Enable syntax coloring on HandHistory files
" let pokerstars_userid = "MyUserId"
" let fulltilt_userid = "MyUserId"
" au BufRead,BufNewFile */HandHistory/*/*.txt set filetype=handhistory
"
" 2) Put this file in the ~/.vim/syntax/ or $VIM\vimfiles\syntax directory
"
" 3) Please email me with any comments, questions, or suggestions.
"
"
" NOTES:
"
" To view a list of the highlight definitions:
"	:so $VIMRUNTIME/syntax/hitest.vim
"
" To view (or change) a specific highlight definition:
" 	:hi Visual
"
" For more information on highlighting:
" 	:help :highlight
"
" TODO:
"
" I'd love to be able to highlight the button.  That is, match
" 'Seat #x is the button' and then highlight the 'Seat x:' afterwards.
"

if version < 600
  syntax clear
elseif exists("b:current_syntax")
  finish
endif

" The cards could be different colors, if desired
syn match Diamond /[AKQJT0-9]d/ contained
syn match Heart /[AKQJT0-9]h/ contained
syn match Spade /[AKQJT0-9]c/ contained
syn match Club /[AKQJT0-9]s/ contained

" Match cards
syn region DealtCards start=/\[/ end=/\]/ contains=Diamond,Heart,Spade,Club

" Match the PokerStars or FullTilt UserID.  Highlight any line with the UserID
if (pokerstars_userid != '')
	exe 'syn keyword UserId ' . pokerstars_userid . ' contained'
	exe 'syn match UserLine /^.*' . pokerstars_userid . '.*/ contains=UserId,DealtCards'
endif

if (fulltilt_userid != '')
	exe 'syn keyword UserId ' . fulltilt_userid . ' contained'
	exe 'syn match UserLine /^.*' . fulltilt_userid . '.*/ contains=UserId,DealtCards'
endif

" Chat and system messages
" Note: Full Tilt chat messages are player: blah, blah, blah.  Finding
" these isn't supported yet.
syn match Chat /^.* adds \$[0-9.]\+/
syn match Chat /^.* has been disconnected/
syn match Chat /^.* has reconnected/
syn match Chat /^.* has requested TIME/
syn match Chat /^.* has returned/
syn match Chat /^.* has \d\+ seconds left to act/
syn match Chat /^.* has timed out/
syn match Chat /^.* is feeling .*/
syn match Chat /^.* is sitting out/
syn match Chat /^.* said, \".*/ contains=UserLine
syn match Chat /^.* stands up/

" Actions (other than folding)
syn match Action /^.* bets \$*[0-9.]\+.*/ contains=UserLine
syn match Action /^.* checks/ contains=UserLine
syn match Action /^.* calls \$*[0-9.]\+.*/ contains=UserLine
syn match Action /^.*: raises [0-9.]\+ to *[0-9.]\+.*/ contains=UserLine
syn match Action /^.* raises *to \$[0-9.]\+.*/ contains=UserLine

" Folds
syn match Fold /^.* folds/ contains=UserLine

" Shows
syn match Shows /.* shows .*/ contains=UserLine,DealtCards

" Pot winner
syn match Collected /^.* collected \d\+ from .*pot$/ contains=UserLine
syn match Collected /^.* wins the pot .*$/ contains=UserLine

" Button
syn match Button /^The button is in seat #\d\+/ contains=UserId
syn match Button /^Table.*Seat #\d\+ is the button/ contains=UserId

syn region Header start=/^PokerStars/ end=/$/
syn region Header start=/^Full Tilt/ end=/$/

syn region Section start=/^\*/ end=/$/ contains=DealtCards

syn region Summary start=/\*\*\* SUMM/ end=/\n\n/ contains=DealtCards,UserLine

"
" Links to defined highlight types
" NOTE: Feel free to modify these, but please let me know if you improve them!
"
highlight clear Folded
highlight Folded guifg=#999999
highlight link UserId	  	Comment
highlight link UserLine	  	Statement
highlight link DealtCards 	PreProc
highlight link Diamond	  	PreProc
highlight link Heart	  	PreProc
highlight link Spade	  	PreProc
highlight link Club			PreProc
highlight link Action		Special
highlight link Fold			Normal
highlight link Chat			Folded
highlight link Collected	Special
highlight link Header		Type
highlight link Section		Constant
highlight link Summary		Constant
highlight link Shows		Normal
highlight link Button		Type

let b:current_syntax = "handhistory"
