import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const languages = [
  {
    value: "all",
    label: "All Languages"
  },
  {
    value: "py",
    label: "Python"
  },
  {
    value: "cpp",
    label: "C++"
  },
  {
    value: "js",
    label: "Javascript"
  },
]

const extraSpace = '\n'.repeat(30);
const CPP_VALUE = '#include<iostream>\nusing namespace std;\nint main(){\n  cout << "Hello world!"; \n  return 0; \n}' + extraSpace
const JS_VALUE = `console.log('Hello world!');` + extraSpace
const PYTHON_VALUE = `print('Hello world!')` + extraSpace
export const mapLanguage = () => {
  const map = []
  map['cpp'] = {code: CPP_VALUE, extensions: cpp};
  map['js'] = {code: JS_VALUE, extensions: javascript};
  map['py'] = {code: PYTHON_VALUE, extensions: python};
  return map;
}