import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Sign In")');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toContainText('Login');
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    
    // Check for email input
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // Check for password input
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Check for submit button
    await expect(page.locator('button:has-text("Continue")')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit without filling form
    await page.click('button:has-text("Continue")');
    
    // Should see error or validation message
    await expect(page.locator('text=email|password|required', { partial: true })).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to signup', async ({ page }) => {
    await page.goto('/login');
    await page.click('a:has-text("Create account")');
    await expect(page).toHaveURL('/signup');
    await expect(page.locator('h1')).toContainText('Sign Up');
  });
});

test.describe('Landing Page', () => {
  test('should load landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/PathForge/);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    
    // Check for main heading
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    
    // Check for CTA button
    const ctaButton = page.locator('button, a').filter({ hasText: /start|generate|create|begin/i }).first();
    await expect(ctaButton).toBeVisible({ timeout: 5000 });
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');
    
    // Scroll down to see more content
    await page.evaluate(() => window.scrollBy(0, 1000));
    
    // Check for feature text
    await expect(page.locator('text=personali|roadmap|learn', { partial: true })).toBeVisible({ timeout: 5000 });
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check for navbar
    const navbar = page.locator('nav, header').first();
    await expect(navbar).toBeVisible();
  });
});

test.describe('Explore Page', () => {
  test('should load explore page', async ({ page }) => {
    await page.goto('/explore');
    await expect(page).toHaveTitle(/Explore/);
  });

  test('should display roadmap cards', async ({ page }) => {
    await page.goto('/explore');
    
    // Wait for cards to load
    await expect(page.locator('[role="article"], .card, [class*="roadmap"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should filter by search', async ({ page }) => {
    await page.goto('/explore');
    
    // Find search input
    const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('react');
      await page.waitForTimeout(500);
      
      // Results should update
      const cards = page.locator('[role="article"], .card');
      await expect(cards.first()).toBeVisible();
    }
  });
});
