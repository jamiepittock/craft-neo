import $ from 'jquery'
import '../jquery-extensions'

import Garnish from 'garnish'
import Craft from 'craft'

import BlockType from './blocktype/BlockType'

import renderTemplate from './configurator.twig'
import '../twig-extensions'
import './configurator.scss'

export default Garnish.Base.extend({

	_defaults: {
		namespace: '',
		blockTypes: []
	},

	_blockTypes: [],

	init(settings = {})
	{
		settings = Object.assign({}, this._defaults, settings)

		// Setup <input> field information
		this.inputNamePrefix = settings.namespace
		this.inputIdPrefix = Craft.formatInputId(this.inputNamePrefix)

		// Initialise the configurator template
		this.$field = $(`\#${this.inputIdPrefix}-neo-configurator`)
		this.$inputContainer = this.$field.children('.field').children('.input')
		this.$inputContainer.html(renderTemplate())

		this.$container = this.$field.find('.input').first()

		this.$blockTypesContainer = this.$container.children('.block-types').children()
		this.$fieldLayoutContainer = this.$container.children('.field-layout').children()

		const $blockTypeItemsContainer = this.$blockTypesContainer.children('.items')
		this.$itemsContainer = $blockTypeItemsContainer.children('.blocktypes')
		this.$addItemButton = $blockTypeItemsContainer.children('.btn.add')

		this.$fieldsContainer = this.$fieldLayoutContainer.children('.items')

		this._blockTypeSort = new Garnish.DragSort(null, {
			handle: '[data-neo="button.move"]',
			axis: 'y',
			magnetStrength: 4,
			helperLagBase: 1.5,
			onSortChange: () => this._updateBlockTypeOrder()
		})

		this._setContainerHeight()

		this.addListener(this.$blockTypesContainer, 'resize', '@setContainerHeight')
		this.addListener(this.$fieldLayoutContainer, 'resize', '@setContainerHeight')
		this.addListener(this.$addItemButton, 'click', '@newBlockType')
	},

	addBlockType(blockType, index = -1)
	{
		if(index >= 0 && index < this._blockTypes.length)
		{
			this._blockTypes = this._blockTypes.splice(index, 0, blockType)
			blockType.$container.insertAt(index, this.$itemsContainer)
		}
		else
		{
			this._blockTypes.push(blockType)
			this.$itemsContainer.append(blockType.$container)
		}

		this._blockTypeSort.addItems(blockType.$container);

		this.$fieldsContainer.append(blockType.getFieldLayout().$container)
		this.$fieldLayoutContainer.removeClass('hidden')

		this.trigger('addBlockType', {
			blockType: blockType,
			index: index
		})

		this._setContainerHeight()
	},

	removeBlockType(blockType)
	{
		this._blockTypes = this._blockTypes.filter(b => b !== blockType)

		this._blockTypeSort.removeItems(blockType.$container);

		blockType.$container.remove()
		blockType.getFieldLayout().$container.remove()

		if(this._blockTypes.length === 0)
		{
			this.$fieldLayoutContainer.addClass('hidden')
		}

		this.trigger('removeBlockType', {
			blockType: blockType
		})

		this._setContainerHeight()
	},

	getBlockTypes()
	{
		return Array.from(this._blockTypes)
	},

	getBlockTypeByElement($element)
	{
		return this._blockTypes.find(blockType =>
		{
			return blockType.$container.is($element)
		})
	},

	_updateBlockTypeOrder()
	{
		const blockTypes = []

		this._blockTypeSort.$items.each((index, element) =>
		{
			const blockType = this.getBlockTypeByElement(element)
			blockTypes.push(blockType)
		})

		this._blockTypes = blockTypes
	},

	_setContainerHeight()
	{
		const maxColHeight = Math.max(400,
			this.$blockTypesContainer.height(),
			this.$fieldLayoutContainer.height())

		this.$container.height(maxColHeight)
	},

	'@newBlockType'()
	{
		const blockType = new BlockType()
		const settingsModal = blockType.getSettingsModal()

		blockType.on('delete', e => this.removeBlockType(blockType))

		const onSave = (e) =>
		{
			this.addBlockType(blockType)
			settingsModal.off('save', onSave)
		}

		const onFadeOut = (e) =>
		{
			settingsModal.enableDeleteButton()
			settingsModal.off('fadeOut', onFadeOut)
		}

		settingsModal.on('save', onSave)
		settingsModal.on('fadeOut', onFadeOut)

		settingsModal.show()
	},

	'@setContainerHeight'()
	{
		setTimeout(() => this._setContainerHeight(), 1)
	}
})
