import { RequiredSettings } from '../Interfaces/IOutputSettings';

export class BackgroundGenerator {
  constructor(
    private _outputSettings: RequiredSettings,
    private _totalLengthMs: number,
  ) {}

  /**
   * This is a custom video track that will be used as background.
   * @returns Background filter string.
   */
  generate(): string {
    const backgroundCommands = [
      'c=black',
      `s=${this._outputSettings.width}x${this._outputSettings.height}`,
      `r=${this._outputSettings.frameRate}`,
      `d=${this._totalLengthMs * 1000}`,
    ];

    return `color=${backgroundCommands.join(':')}[background]`;
  }
}
