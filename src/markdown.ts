export interface PRDescription {
  frontMatter?: string;
  sections: PRSection[];
}

export interface PRSection {
  title: string;
  body: string;
}

function* readLine(text: string) {
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    yield line;
  }
}

function getTitle(line: string): string {
  const match = line.trim().match(/^#+\s*(.+)$/);
  if (match && match[1]) {
    return match[1];
  }
  return "";
}

// To keep things simple, we'll say that any valid markdown
// header counts as a "section" if it's the only thing on that line.
export function parseSections(body: string): PRDescription {
  let frontMatter = "";
  let currentSection: PRSection | undefined;
  const sections: PRSection[] = [];

  for (const line of readLine(body)) {
    if (line.trim().startsWith("#")) {
      currentSection = {
        title: getTitle(line),
        body: "",
      };
      sections.push(currentSection);
    } else if (currentSection) {
      currentSection.body += line;
    } else {
      frontMatter += line;
    }
  }
  return {
    frontMatter,
    sections,
  };
}
