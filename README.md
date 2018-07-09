# Monetize

Monetize is a simple javascript and typescript that shows some money value graphically as single coins. Currently Monetize shows some value in PLN currency. 

### Installation
 - include **Monetize.css** and **Monetize.js** files in your project,
 - insert into your project div with both **Monetize** and **moneySpace** classes, div should be 500px wide and 100px tall to draw coins properly,
 - call Monetize **redraw()** method when document ready to draw coins in your div element:
*Monetize.redraw(moneySpaceElement: HTMLElement, value: number)*
- To enable animation, jQuery need to be included in the project. 



### Configuration

Edit monetize.ts (need to recompile) or monetize.js to configure Monetize. MonetizeSettings class contains all the configuration.
