#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

const config = {
    headless: false,
    slowMo: 50,
    timeout: 300000, // 5 minutes timeout
    debug: true,
    screenshotPath: './screenshots/'
};

class OneNoteAutomation {
  constructor(notebookLink) {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.initialized = false;
    this.notebookLink = notebookLink;
  }
  
  async initialize() {
    if (this.initialized) return;
    
    console.log('Initializing browser automation...');
    this.browser = await chromium.launch({ 
      headless: config.headless,
      slowMo: config.slowMo
    });
    
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    
    // Set default timeout
    this.page.setDefaultTimeout(config.timeout);
    
    // Ensure screenshots directory exists
    await fs.mkdir(config.screenshotPath, { recursive: true });
    
    this.initialized = true;
    console.log('Browser automation initialized.');
  }
  
  async navigateToNotebook() {
    if (!this.initialized) await this.initialize();
    
    console.log('Navigating to notebook...');
    await this.page.goto(this.notebookLink);
    
    // Wait for initial page load
    await this.page.waitForLoadState('domcontentloaded');
    console.log('Initial page load complete');
    
    // Wait for network activity to settle
    await this.page.waitForLoadState('networkidle');
    console.log('Network activity settled');
    
    // Debug: Log page title and URL
    const title = await this.page.title();
    const url = this.page.url();
    console.log('Page loaded:', { title, url });
    
    // Wait for the WebApplicationFrame iframe
    console.log('Waiting for application frame...');
    await this.page.waitForSelector('#WebApplicationFrame');
    
    // Get the frame
    const frame = await this.page.frame({ name: 'WebApplicationFrame' });
    if (!frame) {
      console.log('Frame not found by name, trying by URL...');
      const frames = this.page.frames();
      console.log('Available frames:', frames.map(f => ({ name: f.name(), url: f.url() })));
    }
    
    // Add a delay to allow the large notebook to load
    console.log('Waiting for notebook content to load...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    console.log('Successfully loaded OneNote notebook.');
  }
  
  async captureVisualElements(frame, pagePath) {
    const images = [];
    
    // Find all images and diagrams
    const visualElements = await frame.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('img, svg, canvas, [role="img"]'));
      return elements.map((el, index) => ({
        type: el.tagName.toLowerCase(),
        index: index,
        rect: el.getBoundingClientRect()
      }));
    });

    // Capture each visual element
    for (const element of visualElements) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${pagePath.join('-')}-${element.type}-${element.index}-${timestamp}.png`;
      const filepath = path.join(config.screenshotPath, filename);

      images.push({
        type: element.type,
        path: filepath
      });
    }

    return images;
  }
  
  async extractNotebookStructure() {
    console.log('Extracting notebook structure with content...');
    
    // Get the frame
    const frame = await this.page.frame({ name: 'WebApplicationFrame' });
    if (!frame) {
      throw new Error('Could not find WebApplicationFrame');
    }
    
    // Wait for network activity to settle
    await frame.waitForLoadState('networkidle');
    
    // Get notebook title from the page title
    const notebookTitle = await this.page.title()
      .then(title => title.replace(' - Microsoft OneNote Online', '').trim());
    
    async function getItemInfo(automation, element, level = 0, currentPath = []) {
      const info = {
        name: element.innerText.trim(),
        level: level,
        hasChildren: !!element.querySelector('[aria-label="Expand"]'),
        type: element.className.includes('sectionItem') ? 'section' :
                element.className.includes('pageItem') ? 'page' :
                element.className.includes('groupItem') ? 'group' : 'unknown',
        children: []
      };
      const itemPath = [...currentPath, info.name];


      if (info.type === 'page') {
        try {
          info.content = await automation.readPageContent(itemPath);
        } catch (error) {
          console.error(`Error reading content for page: ${itemPath.join(' > ')}`, error);
          info.content = { title: 'Error', content: 'Could not extract page content', level: 0, images: [] };
        }
      }


      const childList = element.querySelector('[role="group"]');
      if (childList) {
        const children = Array.from(childList.children);
        info.children = await Promise.all(children.map(child => getItemInfo(automation, child, level + 1, itemPath)));
      }

      return info;
    }

    const topLevelItems = Array.from(document.querySelectorAll('.mainItem__navItem___ngX6u')).filter(el => {
      const style = window.getComputedStyle(el);
      const marginLeft = parseInt(style.marginLeft || '0');
      return marginLeft < 20;
    });


    const structure = await Promise.all(topLevelItems.map(item => getItemInfo(this, item)));

    return {
      notebookTitle,
      items: structure
    };
  }

  async readPageContent(path) {
    console.log(`Reading content for page path: ${path.join(' > ')}`);
    await this.navigateToPath(path);
    return await this.readCurrentPage();
  }

  async readCurrentPage() {
    console.log('Reading current page content');
    
    const frame = await this.page.frame({ name: 'WebApplicationFrame' });
    if (!frame) {
      throw new Error('Could not find WebApplicationFrame');
    }

    // Wait for content to load
    await frame.waitForLoadState('networkidle');

    // Get the page content
    let contentText = '';
    try {
      contentText = await frame.evaluate(() => {
        // Try to find the main content area
        const contentArea = document.querySelector('[role="main"]');
        if (!contentArea) {
          console.log('Could not find content area');
          return '';
        }
        return contentArea.innerText.trim();
      });
    } catch (error) {
      console.error('Error while evaluating page content:', error);
      return '';
    }

    return contentText;
  }
  
  async close() {
    if (this.browser) {
      console.log('Closing browser...');
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
      this.initialized = false;
      console.log('Browser closed.');
    }
  }
}

export default OneNoteAutomation;
