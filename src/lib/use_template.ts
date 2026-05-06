/**
 * Clona un template HTML y reemplaza un elemento slot con los hijos del nodo
 * @param node - Elemento donde se insertará el template clonado
 * @param templateRef - Selector CSS del template a clonar
 * @param slotElementRef - Selector CSS del elemento donde se insertarán los hijos (si existen)
 * @example
 * // En HTML: <template id="my-template"><div id="slot"><slot></slot></div></template>
 * // En JS: useTemplate(element, "#my-template", "#slot");
 */
export default function useTemplate(
  node: HTMLElement,
  templateRef: string,
  slotElementRef: string
) {
  const children = Array.from(node.childNodes);
  const template = document.querySelector(
    templateRef,
  ) as HTMLTemplateElement
  const clone = template.content.cloneNode(true) as DocumentFragment;

  if (children.length > 0) {
    const slotElement = clone.querySelector(slotElementRef) as HTMLElement;
    if (slotElement) {
      slotElement.replaceWith(...children);
    }
  }

  node.replaceChildren(clone);
}