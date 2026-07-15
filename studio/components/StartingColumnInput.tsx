import { type StringInputProps, useFormValue } from 'sanity';

import {
  startingColumnList,
  type HomeSectionParent,
} from '../lib/startingColumn';

export function StartingColumnInput(props: StringInputProps) {
  const parentPath = props.path.slice(0, -1);
  const parent = useFormValue(parentPath) as HomeSectionParent | undefined;
  const list = startingColumnList(parent);

  if (list.length === 0) {
    return null;
  }

  return props.renderDefault({
    ...props,
    schemaType: {
      ...props.schemaType,
      options: {
        ...(props.schemaType.options ?? {}),
        list,
        layout: 'radio',
      },
    },
  });
}
