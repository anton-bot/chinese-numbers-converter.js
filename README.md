# chinese-numbers-converter.js
Small library that converts Chinese numbers into arabic `Number`, such as 兩百四十五 into 245.

## Language support ##

Supports Traditional, Simplified, Financial numbers and some dialects.

## Usage examples ##

The `ChineseNumber` class contains only one method: `toInteger()`.

```js
new ChineseNumber('兩百四十五').toInteger(); // 245 - Normal number
new ChineseNumber('345 萬').toInteger(); // 3,450,000 - Mixed Arabic and Chinese
new ChineseNumber(' 二〇一二年').toInteger(); // 2012 - Phone, year etc: without the words "thousand, hundred, ten"
new ChineseNumber('卅六').toInteger(); // 36 - Cantonese slang
new ChineseNumber('1000 and one').toInteger(); // 1000 - ignore non-Chinese words
```

### Possible unexpected results ###

```js
new ChineseNumber(' 二百 or 兩百').toInteger(); // 400 - do not try to parse multiple numbers at once
```

## Availability ##

- Standalone JS class - `chinese-numbers.js`
- NPM package - coming soon

## License and contributing ##

Public domain. You can do everything. 

Pull requests and bug reports are welcome. 
