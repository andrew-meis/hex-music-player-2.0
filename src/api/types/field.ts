import Prism from '@zwolf/prism';

export interface Field {
  locked: boolean;
  name: string;
}

const toField = ($data: Prism<any>): Field => ({
  locked: $data.get<boolean>('locked', { quiet: true }).value,
  name: $data.get<string>('name', { quiet: true }).value,
});

const toFieldList = ($data: Prism<any>): Field[] => $data.toArray().map(toField);

export { toFieldList };
