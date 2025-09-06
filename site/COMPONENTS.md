# Component Catalog

## Callout
- **Props**
  - `type`: "note" | "tip" | "warning" | "danger"
  - `children`: MDX content
- **Example**
  ```mdx
  <Callout type="warning">
    Aspartame is unsafe for individuals with PKU.
  </Callout>
  ```
- **Appears in**
  - content-mdx/posts/ban.mdx (blockquote quote)

## Figure
- **Props**
  - `src`: string
  - `alt`: string
  - `caption?`: string
  - `credit?`: string
- **Example**
  ```mdx
  <Figure src="../images/supplements.jpg" alt="Detox supplements" caption="Detox supports" credit="Healthline" />
  ```
- **Appears in**
  - content-mdx/posts/detox.mdx
  - content-mdx/posts/carcinogenic.mdx
  - content-mdx/pages/index.mdx

## Badge
- **Props**
  - `tone`: "yellow" | "orange" | "red"
  - `children`: string
- **Example**
  ```mdx
  <Badge tone="red">PKU Warning</Badge>
  ```
- **Appears in**
  - _No current usage_

## InlineDef
- **Props**
  - `term`: string
  - `def`: string
- **Example**
  ```mdx
  <InlineDef term="PKU" def="Phenylketonuria" />
  ```
- **Appears in**
  - _No current usage_

## Ref
- **Props**
  - `id`: string
  - `children`: string
- **Example**
  ```mdx
  <Ref id="1">FDA (2024)</Ref>
  ```
- **Appears in**
  - content-mdx/posts/adhd.mdx
  - content-mdx/posts/gut-health.mdx
  - content-mdx/posts/detox.mdx
  - content-mdx/posts/alternatives.mdx
  - content-mdx/posts/aspartame.mdx
  - content-mdx/posts/carcinogenic.mdx

### Additional Patterns

- **Table**
  - Found in: content-mdx/posts/understanding.mdx
  - Suggest `<Table caption>{children}</Table>` component
- **Quiz Placeholder**
  - Found in: content-mdx/pages/quiz.mdx
  - Suggest `<Quiz id />` component

