export class ChineseNumber {
  sourceString: string;

  constructor(sourceString: string) { 
    this.sourceString = sourceString;
  }

  toInteger(): number {
    return 0; // TODO FIXME
  }

  toArabicString(): string {
    return 'TODO FIXME';
  }

  private addMissingUnits(str: string): string {
    return 'TODO FIXME';
  }

  private isArabicNumber(character: string): boolean {
    return true; // TODO FIXME
  }

  private isChineseNumber(character: string): boolean {
    return true; // TODO FIXME
  }

  private isCommaOrSpace(character: string): boolean {
    return true; // TODO FIXME
  }

  private isNumberOrSpace(character: string): boolean {
    return true; // TODO FIXME
  }

  private sourceStringEndsWithAfterManNumber(str: string): string | undefined {
    return; // TODO FIXME
  }
}
