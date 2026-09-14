"""Generated usage examples for DynamoDB entities and repositories"""

from __future__ import annotations

import boto3
import os
import sys

# Import generated entities and repositories
from entities import EmailLookup, User
from repositories import EmailLookupRepository, UserRepository


# Import transaction service for cross-table operations
try:
    from transaction_service import TransactionService

    TRANSACTION_SERVICE_AVAILABLE = True
except ImportError:
    TRANSACTION_SERVICE_AVAILABLE = False
    print('⚠️  TransactionService not available (transaction_service.py not found)')


class UsageExamples:
    """Examples of using the generated entities and repositories"""

    def __init__(self):
        """Initialize repositories with default table names from schema."""
        # Initialize repositories with their respective table names
        # Users table repositories
        try:
            self.user_repo = UserRepository('Users')
            print("✅ Initialized UserRepository for table 'Users'")
        except Exception as e:
            print(f'❌ Failed to initialize UserRepository: {e}')
            self.user_repo = None
        # EmailLookup table repositories
        try:
            self.emaillookup_repo = EmailLookupRepository('EmailLookup')
            print("✅ Initialized EmailLookupRepository for table 'EmailLookup'")
        except Exception as e:
            print(f'❌ Failed to initialize EmailLookupRepository: {e}')
            self.emaillookup_repo = None

        # Initialize TransactionService for cross-table operations
        self.transaction_service = None
        if TRANSACTION_SERVICE_AVAILABLE:
            try:
                dynamodb = boto3.resource('dynamodb')
                self.transaction_service = TransactionService(dynamodb)
                print('✅ Initialized TransactionService for cross-table operations')
            except Exception as e:
                print(f'❌ Failed to initialize TransactionService: {e}')
                self.transaction_service = None

    def run_examples(self, include_additional_access_patterns: bool = False):
        """Run CRUD examples for all entities"""
        # Dictionary to store created entities for access pattern testing
        created_entities = {}

        # Step 0: Cleanup any leftover entities from previous runs (makes tests idempotent)
        print('🧹 Pre-test Cleanup: Removing any leftover entities from previous runs')
        print('=' * 50)
        # Try to delete User (user_id)
        try:
            sample_user = User(
                user_id='user-bob-2024',
                email='bob.smith@example.com',
                full_name='Bob Smith',
                created_at='2024-01-20T14:45:00Z',
            )
            self.user_repo.delete_user(sample_user.user_id)
            print('   🗑️  Deleted leftover user (if existed)')
        except Exception:
            pass  # Ignore errors - item might not exist
        # Try to delete EmailLookup (email)
        try:
            sample_emaillookup = EmailLookup(
                email='bob.smith@example.com', user_id='user-bob-2024'
            )
            self.emaillookup_repo.delete_email_lookup(sample_emaillookup.email)
            print('   🗑️  Deleted leftover emaillookup (if existed)')
        except Exception:
            pass  # Ignore errors - item might not exist
        print('✅ Pre-test cleanup completed\n')

        print('Running Repository Examples')
        print('=' * 50)
        print('\n=== Users Table Operations ===')

        # User example
        print('\n--- User ---')

        # 1. CREATE - Create sample user
        sample_user = User(
            user_id='user-bob-2024',
            email='bob.smith@example.com',
            full_name='Bob Smith',
            created_at='2024-01-20T14:45:00Z',
        )

        print('📝 Creating user...')
        print(f'📝 PK: {sample_user.pk()}, SK: {sample_user.sk()}')

        try:
            created_user = self.user_repo.create_user(sample_user)
            print(f'✅ Created: {created_user}')
            # Store created entity for access pattern testing
            created_entities['User'] = created_user
        except Exception as e:
            # Check if the error is due to item already existing
            if 'ConditionalCheckFailedException' in str(e) or 'already exists' in str(e).lower():
                print('⚠️  user already exists, retrieving existing entity...')
                try:
                    existing_user = self.user_repo.get_user(sample_user.user_id)

                    if existing_user:
                        print(f'✅ Retrieved existing: {existing_user}')
                        # Store existing entity for access pattern testing
                        created_entities['User'] = existing_user
                    else:
                        print('❌ Failed to retrieve existing user')
                except Exception as get_error:
                    print(f'❌ Failed to retrieve existing user: {get_error}')
            else:
                print(f'❌ Failed to create user: {e}')
        # 2. UPDATE - Update non-key field (full_name)
        if 'User' in created_entities:
            print('\n🔄 Updating full_name field...')
            try:
                # Refresh entity to get latest version (handles optimistic locking)
                entity_for_refresh = created_entities['User']
                refreshed_entity = self.user_repo.get_user(entity_for_refresh.user_id)

                if refreshed_entity:
                    original_value = refreshed_entity.full_name
                    refreshed_entity.full_name = 'Robert Smith'

                    updated_user = self.user_repo.update_user(refreshed_entity)
                    print(f'✅ Updated full_name: {original_value} → {updated_user.full_name}')

                    # Update stored entity with updated values
                    created_entities['User'] = updated_user
                else:
                    print('❌ Could not refresh user for update')
            except Exception as e:
                if 'version' in str(e).lower() or 'modified by another process' in str(e).lower():
                    print(f'⚠️  user was modified by another process (optimistic locking): {e}')
                    print('💡 This is expected behavior in concurrent environments')
                else:
                    print(f'❌ Failed to update user: {e}')

        # 3. GET - Retrieve and print the entity
        if 'User' in created_entities:
            print('\n🔍 Retrieving user...')
            try:
                entity_for_get = created_entities['User']
                retrieved_user = self.user_repo.get_user(entity_for_get.user_id)

                if retrieved_user:
                    print(f'✅ Retrieved: {retrieved_user}')
                else:
                    print('❌ Failed to retrieve user')
            except Exception as e:
                print(f'❌ Failed to retrieve user: {e}')

        print('🎯 User CRUD cycle completed!')
        print('\n=== EmailLookup Table Operations ===')

        # EmailLookup example
        print('\n--- EmailLookup ---')

        # 1. CREATE - Create sample emaillookup
        sample_emaillookup = EmailLookup(email='bob.smith@example.com', user_id='user-bob-2024')

        print('📝 Creating emaillookup...')
        print(f'📝 PK: {sample_emaillookup.pk()}, SK: {sample_emaillookup.sk()}')

        try:
            created_emaillookup = self.emaillookup_repo.create_email_lookup(sample_emaillookup)
            print(f'✅ Created: {created_emaillookup}')
            # Store created entity for access pattern testing
            created_entities['EmailLookup'] = created_emaillookup
        except Exception as e:
            # Check if the error is due to item already existing
            if 'ConditionalCheckFailedException' in str(e) or 'already exists' in str(e).lower():
                print('⚠️  emaillookup already exists, retrieving existing entity...')
                try:
                    existing_emaillookup = self.emaillookup_repo.get_email_lookup(
                        sample_emaillookup.email
                    )

                    if existing_emaillookup:
                        print(f'✅ Retrieved existing: {existing_emaillookup}')
                        # Store existing entity for access pattern testing
                        created_entities['EmailLookup'] = existing_emaillookup
                    else:
                        print('❌ Failed to retrieve existing emaillookup')
                except Exception as get_error:
                    print(f'❌ Failed to retrieve existing emaillookup: {get_error}')
            else:
                print(f'❌ Failed to create emaillookup: {e}')
        # 2. UPDATE - Update non-key field (user_id)
        if 'EmailLookup' in created_entities:
            print('\n🔄 Updating user_id field...')
            try:
                # Refresh entity to get latest version (handles optimistic locking)
                entity_for_refresh = created_entities['EmailLookup']
                refreshed_entity = self.emaillookup_repo.get_email_lookup(entity_for_refresh.email)

                if refreshed_entity:
                    original_value = refreshed_entity.user_id
                    refreshed_entity.user_id = 'user-bob-updated-2024'

                    updated_emaillookup = self.emaillookup_repo.update_email_lookup(
                        refreshed_entity
                    )
                    print(f'✅ Updated user_id: {original_value} → {updated_emaillookup.user_id}')

                    # Update stored entity with updated values
                    created_entities['EmailLookup'] = updated_emaillookup
                else:
                    print('❌ Could not refresh emaillookup for update')
            except Exception as e:
                if 'version' in str(e).lower() or 'modified by another process' in str(e).lower():
                    print(
                        f'⚠️  emaillookup was modified by another process (optimistic locking): {e}'
                    )
                    print('💡 This is expected behavior in concurrent environments')
                else:
                    print(f'❌ Failed to update emaillookup: {e}')

        # 3. GET - Retrieve and print the entity
        if 'EmailLookup' in created_entities:
            print('\n🔍 Retrieving emaillookup...')
            try:
                entity_for_get = created_entities['EmailLookup']
                retrieved_emaillookup = self.emaillookup_repo.get_email_lookup(
                    entity_for_get.email
                )

                if retrieved_emaillookup:
                    print(f'✅ Retrieved: {retrieved_emaillookup}')
                else:
                    print('❌ Failed to retrieve emaillookup')
            except Exception as e:
                print(f'❌ Failed to retrieve emaillookup: {e}')

        print('🎯 EmailLookup CRUD cycle completed!')

        print('\n' + '=' * 50)
        print('🎉 Basic CRUD examples completed!')

        # Additional Access Pattern Testing Section (before cleanup)
        if include_additional_access_patterns:
            self._test_additional_access_patterns(created_entities)

        # Cross-Table Pattern Examples Section
        if self.transaction_service:
            self._test_cross_table_patterns(created_entities)

        # Cleanup - Delete all created entities
        print('\n' + '=' * 50)
        print('🗑️  Cleanup: Deleting all created entities')
        print('=' * 50)

        # Delete User
        if 'User' in created_entities:
            print('\n🗑️  Deleting user...')
            try:
                deleted = self.user_repo.delete_user(created_entities['User'].user_id)

                if deleted:
                    print('✅ Deleted user successfully')
                else:
                    print('❌ Failed to delete user (not found or already deleted)')
            except Exception as e:
                print(f'❌ Failed to delete user: {e}')

        # Delete EmailLookup
        if 'EmailLookup' in created_entities:
            print('\n🗑️  Deleting emaillookup...')
            try:
                deleted = self.emaillookup_repo.delete_email_lookup(
                    created_entities['EmailLookup'].email
                )

                if deleted:
                    print('✅ Deleted emaillookup successfully')
                else:
                    print('❌ Failed to delete emaillookup (not found or already deleted)')
            except Exception as e:
                print(f'❌ Failed to delete emaillookup: {e}')
        print('\n💡 Requirements:')
        print("   - DynamoDB table 'Users' must exist")
        print("   - DynamoDB table 'EmailLookup' must exist")
        print('   - DynamoDB permissions: GetItem, PutItem, UpdateItem, DeleteItem')

    def _test_additional_access_patterns(self, created_entities: dict):
        """Test additional access patterns beyond basic CRUD"""
        print('\n' + '=' * 60)
        print('🔍 Additional Access Pattern Testing')
        print('=' * 60)
        print()
        print('📝 No access patterns found in this schema')

    def _test_cross_table_patterns(self, created_entities: dict):
        """Test cross-table pattern examples."""
        print('\n' + '=' * 60)
        print('🔄 Cross-Table Pattern Examples')
        print('=' * 60)
        print()
        print('Testing operations across multiple tables...')
        print()

        # Pattern #102: Get user and email lookup atomically
        print('--- Pattern #102: Get user and email lookup atomically ---')
        print('Operation: TransactGet')
        print('Tables involved: Users, EmailLookup')
        try:
            # Setup: Ensure required entities exist for this transaction
            if 'User' not in created_entities:
                print('   🔧 Setup: Creating User for transaction test...')
                setup_user = User(
                    user_id='user-bob-2024',
                    email='bob.smith@example.com',
                    full_name='Bob Smith',
                    created_at='2024-01-20T14:45:00Z',
                )
                try:
                    created_user = self.user_repo.create_user(setup_user)
                    print('   ✅ Setup complete: User created')
                    created_entities['User'] = created_user
                except Exception as e:
                    if (
                        'ConditionalCheckFailedException' in str(e)
                        or 'already exists' in str(e).lower()
                    ):
                        print('   ⚠️  User already exists, retrieving existing...')
                        try:
                            existing_user = self.user_repo.get_user(setup_user.user_id)
                            if existing_user:
                                print('   ✅ Retrieved existing: User')
                                created_entities['User'] = existing_user
                        except Exception as get_error:
                            print(f'   ❌ Failed to retrieve existing User: {get_error}')
                    else:
                        print(f'   ❌ Failed to create User: {e}')
            if 'EmailLookup' not in created_entities:
                print('   🔧 Setup: Creating EmailLookup for transaction test...')
                setup_emaillookup = EmailLookup(
                    email='bob.smith@example.com', user_id='user-bob-2024'
                )
                try:
                    created_emaillookup = self.emaillookup_repo.create_email_lookup(
                        setup_emaillookup
                    )
                    print('   ✅ Setup complete: EmailLookup created')
                    created_entities['EmailLookup'] = created_emaillookup
                except Exception as e:
                    if (
                        'ConditionalCheckFailedException' in str(e)
                        or 'already exists' in str(e).lower()
                    ):
                        print('   ⚠️  EmailLookup already exists, retrieving existing...')
                        try:
                            existing_emaillookup = self.emaillookup_repo.get_email_lookup(
                                setup_emaillookup.email
                            )
                            if existing_emaillookup:
                                print('   ✅ Retrieved existing: EmailLookup')
                                created_entities['EmailLookup'] = existing_emaillookup
                        except Exception as get_error:
                            print(f'   ❌ Failed to retrieve existing EmailLookup: {get_error}')
                    else:
                        print(f'   ❌ Failed to create EmailLookup: {e}')
            # Execute transaction get
            result = self.transaction_service.get_user_and_email(
                created_entities.get('User').user_id
                if created_entities.get('User')
                else 'user_id123',
                created_entities.get('EmailLookup').email
                if created_entities.get('EmailLookup')
                else 'sample_email',
            )
            print('   ✅ Operation completed successfully')
            print(f'   📊 Result: {result}')
        except NotImplementedError:
            print('   ⚠️  Method not yet implemented (returns pass)')
            print('   💡 Implement the get_user_and_email method in TransactionService')
        except Exception as e:
            print(f'   ❌ Operation failed: {e}')
            if 'TransactionCanceledException' in str(type(e).__name__):
                print(
                    '   💡 This usually means a condition check failed (e.g., item already exists)'
                )

        # Pattern #101: Delete user and email lookup atomically
        print('--- Pattern #101: Delete user and email lookup atomically ---')
        print('Operation: TransactWrite')
        print('Tables involved: Users, EmailLookup')
        try:
            # Setup: Ensure required entities exist for this transaction
            if 'User' not in created_entities:
                print('   🔧 Setup: Creating User for transaction test...')
                setup_user = User(
                    user_id='user-bob-2024',
                    email='bob.smith@example.com',
                    full_name='Bob Smith',
                    created_at='2024-01-20T14:45:00Z',
                )
                try:
                    created_user = self.user_repo.create_user(setup_user)
                    print('   ✅ Setup complete: User created')
                    created_entities['User'] = created_user
                except Exception as e:
                    if (
                        'ConditionalCheckFailedException' in str(e)
                        or 'already exists' in str(e).lower()
                    ):
                        print('   ⚠️  User already exists, retrieving existing...')
                        try:
                            existing_user = self.user_repo.get_user(setup_user.user_id)
                            if existing_user:
                                print('   ✅ Retrieved existing: User')
                                created_entities['User'] = existing_user
                        except Exception as get_error:
                            print(f'   ❌ Failed to retrieve existing User: {get_error}')
                    else:
                        print(f'   ❌ Failed to create User: {e}')
            if 'EmailLookup' not in created_entities:
                print('   🔧 Setup: Creating EmailLookup for transaction test...')
                setup_emaillookup = EmailLookup(
                    email='bob.smith@example.com', user_id='user-bob-2024'
                )
                try:
                    created_emaillookup = self.emaillookup_repo.create_email_lookup(
                        setup_emaillookup
                    )
                    print('   ✅ Setup complete: EmailLookup created')
                    created_entities['EmailLookup'] = created_emaillookup
                except Exception as e:
                    if (
                        'ConditionalCheckFailedException' in str(e)
                        or 'already exists' in str(e).lower()
                    ):
                        print('   ⚠️  EmailLookup already exists, retrieving existing...')
                        try:
                            existing_emaillookup = self.emaillookup_repo.get_email_lookup(
                                setup_emaillookup.email
                            )
                            if existing_emaillookup:
                                print('   ✅ Retrieved existing: EmailLookup')
                                created_entities['EmailLookup'] = existing_emaillookup
                        except Exception as get_error:
                            print(f'   ❌ Failed to retrieve existing EmailLookup: {get_error}')
                    else:
                        print(f'   ❌ Failed to create EmailLookup: {e}')
            # Execute transaction with primitive parameters
            result = self.transaction_service.delete_user_with_email(
                created_entities.get('User').user_id
                if created_entities.get('User')
                else 'user_id123',
                created_entities.get('EmailLookup').email
                if created_entities.get('EmailLookup')
                else 'sample_email',
            )
            print('   ✅ Operation completed successfully')
            print(f'   📊 Result: {result}')
        except NotImplementedError:
            print('   ⚠️  Method not yet implemented (returns pass)')
            print('   💡 Implement the delete_user_with_email method in TransactionService')
        except Exception as e:
            print(f'   ❌ Operation failed: {e}')
            if 'TransactionCanceledException' in str(type(e).__name__):
                print(
                    '   💡 This usually means a condition check failed (e.g., item already exists)'
                )

        # Intermediate Cleanup: Delete CRUD-created entities before testing Create patterns
        # This prevents "already exists" conflicts between CRUD creates and transaction creates
        print('\n' + '=' * 60)
        print('🗑️  Intermediate Cleanup (before Create patterns)')
        print('=' * 60)
        print('Removing CRUD-created entities to avoid conflicts with Create patterns...')
        print()
        if 'User' in created_entities:
            try:
                entity = created_entities['User']
                deleted = self.user_repo.delete_user(entity.user_id)
                if deleted:
                    print('✅ Deleted User')
                    del created_entities['User']
            except Exception as e:
                print(f'⚠️  Failed to delete User: {e}')
        if 'EmailLookup' in created_entities:
            try:
                entity = created_entities['EmailLookup']
                deleted = self.emaillookup_repo.delete_email_lookup(entity.email)
                if deleted:
                    print('✅ Deleted EmailLookup')
                    del created_entities['EmailLookup']
            except Exception as e:
                print(f'⚠️  Failed to delete EmailLookup: {e}')

        # Now test Create patterns on clean slate

        # Pattern #100: Create user and email lookup atomically
        print('--- Pattern #100: Create user and email lookup atomically ---')
        print('Operation: TransactWrite')
        print('Tables involved: Users, EmailLookup')
        try:
            # Create test entities for transaction
            test_user = User(
                user_id='user-bob-2024',
                email='bob.smith@example.com',
                full_name='Bob Smith',
                created_at='2024-01-20T14:45:00Z',
            )
            test_email_lookup = EmailLookup(email='bob.smith@example.com', user_id='user-bob-2024')

            # Execute transaction
            result = self.transaction_service.register_user(test_user, test_email_lookup)
            print('   ✅ Operation completed successfully')
            print(f'   📊 Result: {result}')
        except NotImplementedError:
            print('   ⚠️  Method not yet implemented (returns pass)')
            print('   💡 Implement the register_user method in TransactionService')
        except Exception as e:
            print(f'   ❌ Operation failed: {e}')
            if 'TransactionCanceledException' in str(type(e).__name__):
                print(
                    '   💡 This usually means a condition check failed (e.g., item already exists)'
                )

        print('\n💡 Cross-Table Pattern Notes:')
        print('   - TransactWrite: Atomic write operations (all succeed or all fail)')
        print('   - TransactGet: Atomic read operations across tables')
        print('   - Future: Additional operation types may be supported')
        print('   - Implement pattern methods in transaction_service.py')
        print('   - Handle TransactionCanceledException for condition failures')


def main():
    """Main function to run examples"""
    # 🚨 SAFETY CHECK: Prevent accidental execution against production DynamoDB
    endpoint_url = os.getenv('AWS_ENDPOINT_URL_DYNAMODB', '')

    # Check if running against DynamoDB Local
    is_local = 'localhost' in endpoint_url.lower() or '127.0.0.1' in endpoint_url

    if not is_local:
        print('=' * 80)
        print('🚨 SAFETY WARNING: NOT RUNNING AGAINST DYNAMODB LOCAL')
        print('=' * 80)
        print()
        print(f'Current endpoint: {endpoint_url or "AWS DynamoDB (production)"}')
        print()
        print('⚠️  This script performs CREATE, UPDATE, and DELETE operations that could')
        print('   affect your production data!')
        print()
        print('To run against production DynamoDB:')
        print('  1. Review the code carefully to understand what data will be modified')
        print("  2. Search for 'SAFETY CHECK' in this file")
        print("  3. Comment out the 'raise RuntimeError' line below the safety check")
        print('  4. Understand the risks before proceeding')
        print()
        print('To run safely against DynamoDB Local:')
        print('  export AWS_ENDPOINT_URL_DYNAMODB=http://localhost:8000')
        print()
        print('=' * 80)

        # 🛑 SAFETY CHECK: Comment out this line to run against production
        raise RuntimeError(
            'Safety check: Refusing to run against production DynamoDB. See warning above.'
        )

    # Parse command line arguments
    include_additional_access_patterns = '--all' in sys.argv

    # Check if we're running against DynamoDB Local
    if endpoint_url:
        print(f'🔗 Using DynamoDB endpoint: {endpoint_url}')
        print(f'🌍 Using region: {os.getenv("AWS_DEFAULT_REGION", "us-east-1")}')
    else:
        print('🌐 Using AWS DynamoDB (no local endpoint specified)')

    print('📊 Using multiple tables:')
    print('   - Users')
    print('   - EmailLookup')

    if include_additional_access_patterns:
        print('🔍 Including additional access pattern examples')

    examples = UsageExamples()
    examples.run_examples(include_additional_access_patterns=include_additional_access_patterns)


if __name__ == '__main__':
    main()
