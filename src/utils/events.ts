type ChangableElement = HTMLInputElement | HTMLSelectElement;

export function setNativeValue(element: ChangableElement | null, value?: string) {
  if (!element || !value) return;
  
  const previousValue = element.value;

  if (element.type === 'checkbox' || element.type === 'radio') {
    const input = element as HTMLInputElement;

    if ((!!value && !input.checked) || (!value && input.checked)) {
      element.click();
    }
  } else element.value = value;

  const tracker = (element as any)._valueTracker;

  if (tracker) {
    tracker.setValue(previousValue);
  }

  element.dispatchEvent(new Event('change', { bubbles: true }));
}