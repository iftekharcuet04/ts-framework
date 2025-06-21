import { Handler } from "./types/route-types";

export class RadixNode {
    segment: string;
    isParam: boolean = false;
    paramName?: string;
    handler?: Handler;
    method?: string;
  
    staticChildren: Map<string, RadixNode> = new Map();
    paramChild?: RadixNode;
  
    constructor(segment: string) {
      this.segment = segment;
      if (segment.startsWith(':')) {
        this.isParam = true;
        this.paramName = segment.slice(1);
      }
    }
  
    static create(segment: string, parent?: RadixNode): RadixNode {
        if (!parent) return new RadixNode(segment);
    
        // Reuse static child
        if (!segment.startsWith(':') && parent.staticChildren.has(segment)) {
          return parent.staticChildren.get(segment)!;
        }
    
        // Reuse param child
        if (segment.startsWith(':') && parent.paramChild) {
          return parent.paramChild;
        }
    
        const node = new RadixNode(segment);
    
        if (node.isParam) {
          parent.paramChild = node;
        } else {
          parent.staticChildren.set(segment, node);
        }
    
        return node;
      }
  
    findStaticChild(segment: string): RadixNode | null {
      return this.staticChildren.get(segment) || null;
    }
  }
  