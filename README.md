# chinese-numbers-converter.js

Small library that converts Chinese numbers into an Arabic `Number`, for example 兩百四十五 into `245`.

## Language support ##

Supports Traditional, Simplified, Financial numbers and some dialects. Only integers are supported, except the limited support for Arabic decimal + Chinese number, like "3.5萬". The largest supported character is 億/亿.

## Usage examples ##

The `ChineseNumber` class contains these methods: 

- `toInteger()` - converts a Chinese or mixed number into Arabic and returns a JavaScript `Number` type.
- `toArabicString(minChars)` - translates the entire string (possibly with multiple numbers in it) and returns the same string, but with Arabic numbers. The optional parameter `minChars` is the minimum number of characters that will be translated. For example, you can set it to `2` to avoid translating `九龍` into `9龍`.
- `isNumberOrSpace()` - checks whether the character is part of a number (`true`) or unrelated text (`false`).

```js
new ChineseNumber('兩百四十五').toInteger(); // 245 - Normal number
new ChineseNumber('345 萬').toInteger(); // 3,450,000 - Mixed Arabic and Chinese
new ChineseNumber('3.5萬').toInteger(); // 35,000 - The only supported type of decimals
new ChineseNumber(' 二〇一二年').toInteger(); // 2012 - Phone, year etc: without the words "thousand, hundred, ten"
new ChineseNumber('卅六').toInteger(); // 36 - Cantonese slang
new ChineseNumber('***貳佰零伍元***').toInteger(); // 205 - finance numbers 
new ChineseNumber('1000 and one').toInteger(); // 1000 - ignore non-Chinese words
```

### Possible unexpected results ###

```js
new ChineseNumber(' 二百 or 兩百').toInteger(); // 400 - the toInteger() method only parses one number at once. Use toArabicString() instead.
new ChineseNumber('九龍').toArabicString(); // 9龍 - use the minChars parameter to avoid this
```

## Availability ##

- Standalone JS class - `chinese-numbers.js`
- NPM package - `chinese-numbers-converter`
