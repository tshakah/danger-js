import { DangerResults } from "../../dsl/DangerResults"
import { Violation } from "../../dsl/Violation"

/**
 * Converts a set of violations into a Markdown section
 *
 * @param {string} name User facing title of section
 * @param {string} emoji Emoji name to show
 * @param {Violation[]} violations for section
 * @returns {string} Markdown
 */
function resultsSection(name: string, emoji: string, violations: Violation[]): string {
  if (violations.length === 0 || violations.every(violation => !violation.message)) {
    return ""
  }
  return (
    `\n## ${emoji} ${name}\n` +
    violations
      .map(v => {
        return (
          "> " +
          v.message
            .replace(/<\/?code>/g, "`")
            .split("\n")
            .join("\n> ")
        )
      })
      .join("\n\n") +
    `\n`
  )
}

export const dangerIDToString = (id: string) => `danger-id-${id};`

/**
 * Postfix signature to be attached comment generated / updated by danger.
 */
export const dangerSignaturePostfix = `_Generated by 🚫 [dangerJS](http://github.com/danger/danger-js/)_`

/**
 * A template function for creating a GitHub issue comment from Danger Results
 * @param {string} dangerID A string that represents a unique build
 * @param {DangerResults} results Data to work with
 * @returns {string} HTML
 */
export function template(dangerID: string, results: DangerResults): string {
  return `
${resultsSection("Fails", "🚫", results.fails)}
${resultsSection("Warnings", "⚠️", results.warnings)}
${resultsSection("Messages", "📖", results.messages)}

---

${results.markdowns.join("\n\n")}

${dangerSignaturePostfix}

[](http://${dangerIDToString(dangerID)})
`
}
