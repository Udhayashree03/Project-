import { Order, AppSettings } from '../types';

/**
 * Core Logic Engine for Selective Acceptance
 * 
 * In a real mobile app (React Native/Flutter), this would run in a background task
 * or Accessibility Service listener, intercepting notifications and triggering
 * UI interactions (auto-clicks) based on the result of this function.
 */
export class SelectiveAcceptanceEngine {
  private settings: AppSettings;

  constructor(initialSettings: AppSettings) {
    this.settings = initialSettings;
  }

  public updateSettings(newSettings: AppSettings) {
    this.settings = newSettings;
  }

  /**
   * Evaluates an incoming order against the current profitability and distance parameters.
   * 
   * @param order The incoming order details parsed from the screen/notification.
   * @returns An object containing the decision and the reason.
   */
  public evaluateOrder(order: Order): { accept: boolean; reason: string } {
    if (!this.settings.autoAcceptEnabled) {
      return { accept: false, reason: 'Auto-accept is globally disabled.' };
    }

    if (this.settings.activeApps && !this.settings.activeApps[order.sourceApp]) {
      return { accept: false, reason: `${order.sourceApp} automation is disabled.` };
    }

    if (order.fare < this.settings.minFare) {
      return { 
        accept: false, 
        reason: `Fare (₹${order.fare}) is below minimum threshold (₹${this.settings.minFare}).` 
      };
    }

    if (order.fare > this.settings.maxFare) {
      return { 
        accept: false, 
        reason: `Fare (₹${order.fare}) is above maximum threshold (₹${this.settings.maxFare}).` 
      };
    }

    if (order.pickupDistance > this.settings.maxDistance) {
      return { 
        accept: false, 
        reason: `Pickup distance (${order.pickupDistance}km) exceeds maximum (${this.settings.maxDistance}km).` 
      };
    }

    return { accept: true, reason: 'Order meets all profitability and distance criteria.' };
  }

  /**
   * Simulates the execution of the auto-click action.
   * In a real app, this would use Accessibility Services to dispatch a gesture.
   */
  public async executeAcceptAction(order: Order): Promise<void> {
    return new Promise((resolve) => {
      const totalDelay = this.settings.timeDurationMs + this.settings.swipeDurationMs;
      setTimeout(() => {
        console.log(`[EXECUTION] Auto-accepted order ${order.id} within ${totalDelay}ms.`);
        resolve();
      }, totalDelay);
    });
  }
}
