/**
 * Share & Member Management Tools
 * 共有リンク管理・メンバー管理
 */

export const shareTools = [
  // === 共有リンク管理 ===
  {
    name: 'create_share_link',
    description: 'シートの共有リンクを発行。既存のアクティブな共有がある場合は再利用される',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'シートID'
        },
        permission: {
          type: 'string',
          description: '権限: read（閲覧のみ）, write（編集可能）。デフォルト: read',
          enum: ['read', 'write'],
          default: 'read'
        },
        expiry: {
          type: 'string',
          description: '有効期限: never（無期限）, 1day, 7days, 30days。デフォルト: 7days',
          enum: ['never', '1day', '7days', '30days'],
          default: '7days'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'get_share_settings',
    description: 'シートの現在の共有設定を取得',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'シートID'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'disable_share',
    description: '共有リンクを無効化',
    inputSchema: {
      type: 'object',
      properties: {
        share_id: {
          type: 'string',
          description: '共有ID（create_share_linkまたはget_share_settingsで取得）'
        }
      },
      required: ['share_id']
    }
  },

  // === メンバー管理 ===
  {
    name: 'list_members',
    description: 'シートのメンバー一覧を取得',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'シートID'
        }
      },
      required: ['id']
    }
  },
  {
    name: 'add_member',
    description: 'シートにメンバーを追加（招待）。オーナーのみ実行可能',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'シートID'
        },
        email: {
          type: 'string',
          description: '招待するユーザーのメールアドレス'
        },
        role: {
          type: 'string',
          description: '付与するロール: viewer（閲覧者）, editor（編集者）, owner（オーナー）。デフォルト: viewer',
          enum: ['viewer', 'editor', 'owner'],
          default: 'viewer'
        }
      },
      required: ['id', 'email']
    }
  },
  {
    name: 'update_member_role',
    description: 'メンバーの権限を変更。オーナーのみ実行可能',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'シートID'
        },
        uid: {
          type: 'string',
          description: '対象ユーザーのUID'
        },
        role: {
          type: 'string',
          description: '新しいロール: viewer, editor, owner',
          enum: ['viewer', 'editor', 'owner']
        }
      },
      required: ['id', 'uid', 'role']
    }
  },
  {
    name: 'remove_member',
    description: 'シートからメンバーを削除。オーナーのみ実行可能',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'シートID'
        },
        uid: {
          type: 'string',
          description: '削除するユーザーのUID'
        }
      },
      required: ['id', 'uid']
    }
  }
];

export async function handleShareTool(name, args, client) {
  switch (name) {
    // === 共有リンク管理 ===
    case 'create_share_link': {
      const result = await client.createShareLink(
        args.id,
        args.permission || 'read',
        args.expiry || '7days'
      );

      return {
        success: true,
        share_id: result.share_id,
        share_url: result.share_url,
        permission: result.permission,
        expiry: result.expiry,
        expires_at: result.expires_at,
        reused_existing: result.reused_existing || false,
        message: result.reused_existing
          ? 'Existing share link returned'
          : 'New share link created'
      };
    }

    case 'get_share_settings': {
      const result = await client.getShareSettings(args.id);

      if (!result.has_active_share) {
        return {
          id: args.id,
          has_active_share: false,
          message: 'No active share links'
        };
      }

      return {
        id: args.id,
        has_active_share: true,
        share: result.share
      };
    }

    case 'disable_share': {
      const result = await client.disableShare(args.share_id);

      return {
        success: true,
        share_id: args.share_id,
        message: 'Share link disabled successfully'
      };
    }

    // === メンバー管理 ===
    case 'list_members': {
      const result = await client.listMembers(args.id);

      return {
        id: args.id,
        count: result.count,
        members: result.members.map(m => ({
          uid: m.uid,
          name: m.name,
          role: m.role,
          isOwner: m.isOwner,
          joinedAt: m.joinedAt
        }))
      };
    }

    case 'add_member': {
      const result = await client.addMember(
        args.id,
        args.email,
        args.role || 'viewer'
      );

      return {
        success: true,
        id: args.id,
        member: result.member,
        message: result.message || 'Member added successfully'
      };
    }

    case 'update_member_role': {
      const result = await client.updateMemberRole(
        args.id,
        args.uid,
        args.role
      );

      return {
        success: true,
        id: args.id,
        uid: args.uid,
        new_role: args.role,
        message: result.message || 'Member role updated successfully'
      };
    }

    case 'remove_member': {
      const result = await client.removeMember(args.id, args.uid);

      return {
        success: true,
        id: args.id,
        uid: args.uid,
        message: result.message || 'Member removed successfully'
      };
    }

    default:
      throw new Error(`Unknown share tool: ${name}`);
  }
}
