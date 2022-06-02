import { ParagraphProperties } from './paragraph';
import { RunProperties } from './run';

export interface IDomStyle {
  id: string | null;
  name?: string | null;
  cssName?: string | null;
  aliases?: string[];
  target: string | null;
  basedOn?: string | null;
  isDefault?: boolean;
  styles: IDomSubStyle[];
  linked?: string | null;
  next?: string | null;

  paragraphProps?: ParagraphProperties;
  runProps?: RunProperties;
}

export interface IDomSubStyle {
  target: string;
  mod?: string;
  values: Record<string, string>;
}
