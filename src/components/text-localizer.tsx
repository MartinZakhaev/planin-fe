"use client";

import { useEffect } from "react";

import { translateText } from "@/lib/i18n";
import { useLanguage } from "@/context/language-context";

const originalTextNodes = new WeakMap<Text, string>();
const localizedAttributes = ["placeholder", "aria-label", "title"];

function localizeTextNode(node: Text, language: "en" | "id") {
  const originalValue = originalTextNodes.get(node) ?? node.nodeValue ?? "";

  if (!originalTextNodes.has(node)) {
    originalTextNodes.set(node, originalValue);
  }

  const nextValue = translateText(originalValue, language);

  if (node.nodeValue !== nextValue) {
    node.nodeValue = nextValue;
  }
}

function localizeElementAttributes(element: Element, language: "en" | "id") {
  localizedAttributes.forEach((attribute) => {
    const value = element.getAttribute(attribute);

    if (!value) {
      return;
    }

    const originalAttribute = `data-i18n-original-${attribute}`;
    const originalValue = element.getAttribute(originalAttribute) ?? value;

    if (!element.hasAttribute(originalAttribute)) {
      element.setAttribute(originalAttribute, originalValue);
    }

    const nextValue = translateText(originalValue, language);

    if (value !== nextValue) {
      element.setAttribute(attribute, nextValue);
    }
  });
}

function localizeTree(root: ParentNode, language: "en" | "id") {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    localizeTextNode(node as Text, language);
    node = walker.nextNode();
  }

  if (root instanceof Element) {
    localizeElementAttributes(root, language);
  }

  root.querySelectorAll?.("*").forEach((element) => {
    localizeElementAttributes(element, language);
  });
}

export function TextLocalizer() {
  const { language } = useLanguage();

  useEffect(() => {
    localizeTree(document.body, language);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            localizeTextNode(node as Text, language);
          }

          if (node.nodeType === Node.ELEMENT_NODE) {
            localizeTree(node as Element, language);
          }
        });

        if (mutation.type === "attributes" && mutation.target instanceof Element) {
          localizeElementAttributes(mutation.target, language);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: localizedAttributes,
    });

    return () => observer.disconnect();
  }, [language]);

  return null;
}

