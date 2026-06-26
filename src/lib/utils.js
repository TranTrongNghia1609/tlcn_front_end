import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { ruby } from "codemirror-lang-ruby";
import { perl } from "codemirror-lang-perl";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const languages = [
  {
    value: "all",
    label: "All Languages"
  },
  {
    value: "python",
    label: "Python",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"
  },
  {
    value: "cpp",
    label: "C++",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg"
  },
  {
    value: "js",
    label: "Javascript",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"
  },
  {
    value: "rb",
    label: "Ruby",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg"
  },
  {
    value: "pl",
    label: "Perl",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/perl/perl-original.svg"
  },
  {
    value: "cs",
    label: "C#",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg"
  }
]

const extraSpace = '\n'.repeat(30);
const CPP_VALUE = '#include<iostream>\nusing namespace std;\nint main(){\n  cout << "Hello world!"; \n  return 0; \n}' + extraSpace
const JS_VALUE = `console.log('Hello world!');` + extraSpace
const PYTHON_VALUE = `print('Hello world!')` + extraSpace
const RB_VALUE = `puts 'Hello world!';` + extraSpace
const PL_VALUE = `print "Hello world!";` + extraSpace
const CS_VALUE = `Console.WriteLine("Hello world!");` + extraSpace
export const mapLanguage = () => {
  const map = []
  map['cpp'] = { code: CPP_VALUE, extensions: cpp };
  map['js'] = { code: JS_VALUE, extensions: javascript };
  map['py'] = { code: PYTHON_VALUE, extensions: python };
  map['rb'] = { code: RB_VALUE, extensions: ruby };
  map['pl'] = { code: PL_VALUE, extensions: perl };
  map['cs'] = { code: CS_VALUE, extensions: cpp };
  return map;
}